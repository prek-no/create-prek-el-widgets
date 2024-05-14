# Create Elementor Widgets with React

The easiest way to create Elementor widgets with React. This CLI tool will help you create a new project with all the necessary configurations to start developing Elementor widgets with React.

## Interactive

You can create a new project interactively by running:

```bash
npx create-prek-el-widgets@latest
# or
pnpm create prek-el-widgets
# or
yarn create prek-el-widgets
# or
bunx create-prek-el-widgets
```

You will be asked for the name of your project, and then whether you want to create a TypeScript project:

```bash
✔ Would you like to use TypeScript? … No / Yes
```

Select Yes to install the necessary types/dependencies and create a new TS project.

## Non-interactive

You can also pass command line arguments to set up a new project non-interactively. See create-prek-el-widgets --help:

```bash
Usage: create-prek-el-widgets <project-directory> [options]

Options:
  -V, --version                        output the version number
  --ts, --typescript

    Initialize as a TypeScript project. (default)

  --tailwind

    Initialize with Tailwind CSS config. (default)

  --eslint

    Initialize with eslint config.

  --import-alias <alias-to-configure>

    Specify import alias to use (default "@/*").

  --use-npm

    Explicitly tell the CLI to bootstrap the application using npm

  --use-pnpm

    Explicitly tell the CLI to bootstrap the application using pnpm

  --use-yarn

    Explicitly tell the CLI to bootstrap the application using Yarn

  --use-bun

    Explicitly tell the CLI to bootstrap the application using Bun

  --reset-preferences

    Explicitly tell the CLI to reset any stored preferences

  --skip-install

    Explicitly tell the CLI to skip installing packages
```

For example, to create a new project with TypeScript and Tailwind CSS:

```bash
npx create-prek-el-widgets@latest my-new-project --ts --tailwind
```

## Configuration

The CLI tool will create a new project with the following structure:

```bash
my-new-project
├── .gitignore
├── package.json
├── README.md
├── src
│   ├── App.tsx
│   ├── index.tsx
│   ├── plugin.ts
└── tsconfig.json
```

When adding or updating widgets, update the following file:

- `src/plugin.ts`: The Elementor plugin configuration.

## Example

There's a sample widget included in this project. To see it in action, run the following commands:

```bash
npx create-prek-el-widgets@latest my-new-project --ts --tailwind
cd my-new-project

# Generate plugin zip
pnpm plugin-zip
```

Then, install the generated my-new-project.zip file as a plugin in your WordPress site. Now open the Elementor editor and search for "my new project" to see the sample widget. Drag it to the canvas and see it in action.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

