'use strict';
/* eslint-disable import/no-extraneous-dependencies */
import { cyan, green, red, yellow, bold, blue } from 'picocolors'
import prompts, { InitialReturnValue } from 'prompts'
import { validateNpmName } from '../helpers/validate-pkg';
import Commander, { Command } from 'commander'
import { isFolderEmpty } from '../helpers/is-folder-empty';
import Conf from 'conf';
import path from 'path';
import fs from 'fs'
import ciInfo from 'ci-info'
import { createPlugin } from '../create-plugin';
import { packageManager } from './commander';

let projectPath: string = ''

const handleSigTerm = () => process.exit(0)

process.on('SIGINT', handleSigTerm)
process.on('SIGTERM', handleSigTerm)

const onPromptState = (state: {
    value: InitialReturnValue
    aborted: boolean
}) => {
    if (state.aborted) {
        // If we don't re-enable the terminal cursor before exiting
        // the program, the cursor will remain hidden
        process.stdout.write('\x1B[?25h')
        process.stdout.write('\n')
        process.exit(1)
    }
}

async function run(projectPath = 'my-plugin', program: Command): Promise<void> {
    const conf = new Conf({ projectName: 'create-prek-wp-plugin' })
    
    if (program.resetPreferences) {
        conf.clear()
        console.log(`Preferences reset successfully`)
        return
    }
    
    if (typeof projectPath === 'string') {
        projectPath = projectPath.trim()
    }
    
    // Project name is not set, prompt for it
    if (!projectPath) {
        const res = await prompts({
            onState: onPromptState,
            type: 'text',
            name: 'path',
            message: 'Project directory:',
            initial: projectPath || 'my-plugin',
            validate: (name: string) => {
                const validation = validateNpmName(path.basename(path.resolve(name)))
                if (validation.valid) {
                    return true
                }
                return 'Invalid project name: ' + validation.problems[0]
            },
        });
        
        // Set the project path to the user input
        if (typeof res.path === 'string') {
            projectPath = res.path.trim()
        }
    }
    
    // No project path is specified, error out
    if (!projectPath) {
        console.log(
            '\nPlease specify the project directory:\n' +
            `  ${cyan(program.name())} ${green('<project-directory>')}\n` +
            'For example:\n' +
            `  ${cyan(program.name())} ${green('my-next-app')}\n\n` +
            `Run ${cyan(`${program.name()} --help`)} to see all options.`
        )
        process.exit(1)
    }
    
    // Validate the project name
    const resolvedProjectPath = path.resolve(projectPath)
    const projectName = path.basename(resolvedProjectPath)
    
    const validation = validateNpmName(projectName)
    
    // If the project name is invalid, error out
    if (!validation.valid) {
        console.error(`Could not create a project called ${red(`"${projectName}"`)} because of npm naming restrictions:`)
        
        validation.problems.forEach((p) => {
            console.error(`    ${red(bold('*'))} ${p}`)
        })
        
        process.exit(1)
    }
    
    /**
    * Verify the project dir is empty or doesn't exist
    */
    const root = path.resolve(resolvedProjectPath)
    const appName = path.basename(root)
    const folderExists = fs.existsSync(root)
    
    if (folderExists && !isFolderEmpty(root, appName)) {
        process.exit(1)
    }
    
    const preferences = (conf.get('preferences') || {}) as Record<string,boolean | string>
    
    const defaults: typeof preferences = {
        pluginName: 'My Plugin',
        typescript: true,
        eslint: true,
        tailwind: true,
        app: true,
        srcDir: false,
        importAlias: '~/*',
        customizeImportAlias: false,
    }
    
    const getPrefOrDefault = (field: string) => preferences[field] ?? defaults[field]
    
    // Plugin name
    if (typeof program.pluginName !== 'string') {
        if (ciInfo.isCI) {
            program.pluginName = getPrefOrDefault('pluginName')
        } else {
            const { pluginName } = await prompts({
                onState: onPromptState,
                type: 'text',
                name: 'pluginName',
                message: 'What is the name of your plugin?',
                initial: getPrefOrDefault('pluginName'),
            })
            program.pluginName = pluginName
            preferences.pluginName = pluginName
        }
    }

    // Typescript
    if (!program.typescript && !program.javascript) {
        if (ciInfo.isCI) {
            // default to TypeScript in CI as we can't prompt to
            // prevent breaking setup flows
            program.typescript = getPrefOrDefault('typescript') as boolean
        } else {
            const styledTypeScript = blue('TypeScript')
            const { typescript } = await prompts(
                {
                    type: 'toggle',
                    name: 'typescript',
                    message: `Would you like to use ${styledTypeScript}?`,
                    initial: getPrefOrDefault('typescript'),
                    active: 'Yes',
                    inactive: 'No',
                },
                {
                    /**
                    * User inputs Ctrl+C or Ctrl+D to exit the prompt. We should close the
                    * process and not write to the file system.
                    */
                    onCancel: () => {
                        console.error('Exiting.')
                        process.exit(1)
                    },
                }
            )
            /**
            * Depending on the prompt response, set the appropriate program flags.
            */
            program.typescript = Boolean(typescript)
            program.javascript = !Boolean(typescript)
            preferences.typescript = Boolean(typescript)
        }
    }
    
    // ESLint
    if (
        !process.argv.includes('--eslint') &&
        !process.argv.includes('--no-eslint')
    ) {
        if (ciInfo.isCI) {
            program.eslint = getPrefOrDefault('eslint')
        } else {
            const styledEslint = blue('ESLint')
            const { eslint } = await prompts({
                onState: onPromptState,
                type: 'toggle',
                name: 'eslint',
                message: `Would you like to use ${styledEslint}?`,
                initial: getPrefOrDefault('eslint'),
                active: 'Yes',
                inactive: 'No',
            })
            program.eslint = Boolean(eslint)
            preferences.eslint = Boolean(eslint)
        }
    }
    
    // Tailwind CSS
    if (
        !process.argv.includes('--tailwind') &&
        !process.argv.includes('--no-tailwind')
    ) {
        if (ciInfo.isCI) {
            program.tailwind = getPrefOrDefault('tailwind')
        } else {
            const tw = blue('Tailwind CSS')
            const { tailwind } = await prompts({
                onState: onPromptState,
                type: 'toggle',
                name: 'tailwind',
                message: `Would you like to use ${tw}?`,
                initial: getPrefOrDefault('tailwind'),
                active: 'Yes',
                inactive: 'No',
            })
            program.tailwind = Boolean(tailwind)
            preferences.tailwind = Boolean(tailwind)
        }
    }
    
    const importAliasPattern = /^[^*"]+\/\*\s*$/
    if (
        typeof program.importAlias !== 'string' ||
        !importAliasPattern.test(program.importAlias)
    ) {
        if (ciInfo.isCI) {
            // We don't use preferences here because the default value is @/* regardless of existing preferences
            program.importAlias = defaults.importAlias
        } else if (process.argv.includes('--no-import-alias')) {
            program.importAlias = defaults.importAlias
        } else {
            const styledImportAlias = blue('import alias')
            
            const { customizeImportAlias } = await prompts({
                onState: onPromptState,
                type: 'toggle',
                name: 'customizeImportAlias',
                message: `Would you like to customize the default ${styledImportAlias} (${defaults.importAlias})?`,
                initial: getPrefOrDefault('customizeImportAlias'),
                active: 'Yes',
                inactive: 'No',
            })
            
            if (!customizeImportAlias) {
                // We don't use preferences here because the default value is @/* regardless of existing preferences
                program.importAlias = defaults.importAlias
            } else {
                const { importAlias } = await prompts({
                    onState: onPromptState,
                    type: 'text',
                    name: 'importAlias',
                    message: `What ${styledImportAlias} would you like configured?`,
                    initial: getPrefOrDefault('importAlias'),
                    validate: (value) =>
                        importAliasPattern.test(value)
                    ? true
                    : 'Import alias must follow the pattern <prefix>/*',
                })
                program.importAlias = importAlias
                preferences.importAlias = importAlias
            }
        }
    }
    
    try {
        console.log("Creating plugin");
        await createPlugin({
            pluginDir: resolvedProjectPath,
            pluginName: program.pluginName,
            packageManager,
            typescript: program.typescript,
            tailwind: program.tailwind,
            eslint: program.eslint,
            importAlias: program.importAlias,
            skipInstall: program.skipInstall
        })
    } catch (reason) {
        console.error('Aborting installation.')
        console.error(reason)
        process.exit(1)
    } finally {
        conf.set('preferences', preferences)
    }
}

export {
    run as createPrompt
}