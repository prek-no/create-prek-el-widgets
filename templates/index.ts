import { install } from "../helpers/install";
import { copy } from "../helpers/copy";
import { async as glob } from "fast-glob";
import os from "os";
import fs from "fs/promises";
import path from "path";
import { cyan, bold } from "picocolors";
import { Sema } from "async-sema";
import pkg from "../package.json";
import { GetTemplateFileArgs, InstallTemplateArgs } from "./types";
import replaceInFile from "replace-in-file";

/**
* Get the file path for a given file in a template
*/
export const getTemplateFile = ({
    template,
    file,
}: GetTemplateFileArgs): string => {
    return path.join(__dirname, template, file);
};

export const installTemplate = async ({
    pluginDir,
    pluginName,
    root,
    mode,
    packageManager,
    isOnline,
    template,
    tailwind,
    eslint,
    importAlias,
    skipInstall,
}: InstallTemplateArgs) => {
    console.log(bold(`Using ${packageManager}.`));
    
    /**
    * Copy the template files to the target directory.
    */
    console.log("\nInitializing project with template:", template, "\n");
    
    const templatePath = path.join(__dirname, 'templates', template);
    const copySource = ["**"];
    if (!eslint) copySource.push("!eslintrc.json");
    if (!tailwind) {
        copySource.push(
            mode == "ts" ? "tailwind.config.ts" : "!tailwind.config.js",
            "!postcss.config.mjs",
        );
    }
    
    // Copy the template files to the target directory
    await copy(copySource, root, {
        parents: true,
        cwd: templatePath,
        rename(name) {
            switch (name) {
                case "gitignore":
                case "eslintrc.json": {
                    return `.${name}`;
                }
                // README.md is ignored by webpack-asset-relocator-loader used by ncc:
                // https://github.com/vercel/webpack-asset-relocator-loader/blob/e9308683d47ff507253e37c9bcbb99474603192b/src/asset-relocator.js#L227
                case "README-template.md": {
                    return "README.md";
                }
                case "plugin-name.php": {
                    return `${pluginDir}.php`;
                }
                default: {
                    return name;
                }
            }
        },
    });
    
    // Replacements
    const replacements = {
        PLUGIN_NAME: pluginName,
        PLUGIN_DIRNAME: pluginDir,
        PLUGIN_WIDGET: pluginDir.replace(/-/g, "_").toUpperCase(),
        PLUGIN_LOWER_WIDGET: pluginDir.replace(/-/g, "_").toLowerCase(),
    };

    // Replace the placeholders
    await replaceInFile({
        files: path.join(root, '**', '*'),
        from: Object.keys(replacements).map((key) => new RegExp(key, 'g')),
        to: Object.values(replacements),
    });

    // Rename the widgets/plugin-name folder
    await fs.rename(
        path.join(root, "widgets", "widget-name"),
        path.join(root, "widgets", `${pluginDir}-widget`),
    );
    
    // Update the tsconfig.json file to use the correct import alias
    const tsconfigFile = path.join(root, "tsconfig.json");
    
    // Update import alias in any files if not using the default
    if (importAlias !== "~/*") {
        const files = await glob("**/*", {
            cwd: root,
            dot: true,
            stats: false,
            // We don't want to modify compiler options in [ts/js]config.json
            // and none of the files in the .git folder
            ignore: ["tsconfig.json", "jsconfig.json", ".git/**/*"],
        });
        const writeSema = new Sema(8, { capacity: files.length });
        await Promise.all(
            files.map(async (file) => {
                await writeSema.acquire();
                const filePath = path.join(root, file);
                if ((await fs.stat(filePath)).isFile()) {
                    await fs.writeFile(
                        filePath,
                        (await fs.readFile(filePath, "utf8")).replace(
                            `~/`,
                            `${importAlias.replace(/\*/g, "")}`,
                        ),
                    );
                }
                writeSema.release();
            }),
        );
    }
    
    /** Copy the version from package.json or override for tests. */
    const version = process.env.NEXT_PRIVATE_TEST_VERSION ?? pkg.version;
    
    /** Create a package.json for the new project and write it to disk. */
    const packageJson: any = {
        name: pluginDir,
        version: "0.1.0",
        license: "MIT",
        private: true,
        scripts: {
            test: "echo \"Error: no test specified\" && exit 1",
            preview: "npm-run-all --parallel sync startwp tailwindwatch",
            sync: "browser-sync start -p 'https://wordpress.dev/sample-page' --files '**/*.php' 'build/*.js' 'build/*.css'",
            build: "npm-run-all --sequential buildwp tailwindbuild",
            buildwp: "wp-scripts build",
            tailwindbuild: "tailwindcss -i ./src/index.scss -o ./build/index.css --postcss --minify",
            tailwindwatch: "tailwindcss -i ./src/index.scss -o ./build/index.css --watch --postcss --minify",
            startwp: "wp-scripts start",
            start: "npm-run-all --parallel startwp tailwindwatch",
            "plugin-zip": "pnpm build && wp-scripts plugin-zip"
        },
        files: [
            "*.php",
            "/extensions",
            "/widgets",
            "/actions",
            "/build"
        ],
        resolutions: {
            react: "^18.2.0",
            "react-reconciler": "^0.29.0"
        },
        peerDependencies: {
            react: "^18.2.0",
            "react-dom": "^18.2.0"
        },
        /**
        * Default dependencies.
        */
        dependencies: {
            "@heroicons/react": "^2.0.18",
            classnames: "^2.3.2",
            lodash: "^4.17.21",
            "react-hook-inview": "^4.5.0",
            "react-reconciler": "^0.29.0",
            "react-simple-i18n": "^1.4.0"
        },
        devDependencies: {
            "@types/lodash": "^4.14.202",
            "@types/react": "^18",
            "@types/react-dom": "^18",
            "@wordpress/core-data": "^6.32.0",
            "@wordpress/data": "^9.25.0",
            "@wordpress/element": "^5.32.0",
            "@wordpress/html-entities": "^3.55.0",
            "@wordpress/scripts": "^27.6.0",
            "browser-sync": "^2.29.1",
            postcss: "^8.4.21",
            "postcss-import": "^15.1.0",
            "postcss-nested": "^6.0.1",
            tailwindcss: "^3.3.1",
            "ts-loader": "^9.4.2",
            "tsconfig-paths-webpack-plugin": "^4.1.0",
            typescript: "^5",
            "yarn-run-all": "^3.1.1"
        },
    };
    
    /* Add Tailwind CSS dependencies. */
    /*if (tailwind) {
        packageJson.devDependencies = {
            ...packageJson.devDependencies,
            postcss: "^8",
            tailwindcss: "^3.4.1",
        };
    }*/
    
    /* Default ESLint dependencies. */
    if (eslint) {
        packageJson.devDependencies = {
            ...packageJson.devDependencies,
            eslint: "^8",
            // "eslint-config-next": version,
        };
    }
    
    const devDeps = Object.keys(packageJson.devDependencies).length;
    if (!devDeps) delete packageJson.devDependencies;
    
    await fs.writeFile(
        path.join(root, "package.json"),
        JSON.stringify(packageJson, null, 2) + os.EOL,
    );
    
    if (skipInstall) return;
    
    console.log("\nInstalling dependencies:");
    for (const dependency in packageJson.dependencies)
        console.log(`- ${cyan(dependency)}`);
    
    if (devDeps) {
        console.log("\nInstalling devDependencies:");
        for (const dependency in packageJson.devDependencies)
            console.log(`- ${cyan(dependency)}`);
    }
    
    console.log();
    
    await install(packageManager, isOnline);
}

export * from "./types";