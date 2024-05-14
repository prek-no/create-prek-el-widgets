/* eslint-disable import/no-extraneous-dependencies */
import path from "path"
import fs from 'fs'
import { PackageManager } from "./helpers/get-pkg-manager"
import { installTemplate, type TemplateMode, type TemplateType } from './templates'
import { isWriteable } from "./helpers/is-writeable"
import { isFolderEmpty } from "./helpers/is-folder-empty"
import { getOnline } from "./helpers/is-online"
import { cyan, green } from "picocolors"

export interface CreatePluginProps {
    pluginDir: string
    pluginName: string;
    packageManager: PackageManager
    typescript: boolean
    tailwind: boolean
    eslint: boolean
    importAlias: string
    skipInstall: boolean
}

export async function createPlugin(props: CreatePluginProps) {
    const {
        pluginDir,
        pluginName,
        packageManager,
        typescript,
        tailwind,
        eslint,
        importAlias,
        skipInstall,
    } = props
    
    const mode: TemplateMode = typescript ? 'ts' : 'js'
    const template: TemplateType = `default${tailwind ? '-tw' : ''}`
    const root = path.resolve(pluginDir)
    
    // Check if the root is writeable
    if (!(await isWriteable(path.dirname(root)))) {
        console.error(
            'The application path is not writable, please check folder permissions and try again.'
        )
        console.error(
            'It is likely you do not have write permissions for this folder.'
        )
        process.exit(1)
    }
    
    const appName = path.basename(root)
    
    fs.mkdirSync(root, { recursive: true })
    if (!isFolderEmpty(root, appName)) {
        process.exit(1)
    }
    
    const useYarn = packageManager === 'yarn'
    const isOnline = !useYarn || (await getOnline())
    const originalDirectory = process.cwd()
    
    console.log(`Creating a new Wordpress React plugin in ${green(root)}.`)
    console.log()
    
    process.chdir(root)
    
    const packageJsonPath = path.join(root, 'package.json')
    let hasPackageJson = false
    
    /**
    * If an example repository is not provided for cloning, proceed
    * by installing from a template.
    */
    await installTemplate({
        pluginDir: appName,
        pluginName,
        root,
        mode,
        template,
        packageManager,
        isOnline,
        tailwind,
        eslint,
        importAlias,
        skipInstall,
    })
    
    let cdpath: string
    if (path.join(originalDirectory, appName) === pluginDir) {
        cdpath = appName
    } else {
        cdpath = pluginDir
    }
    
    console.log(`${green('Success!')} Created ${appName} at ${pluginDir}`)
    
    if (hasPackageJson) {
        console.log('Inside that directory, you can run several commands:')
        console.log()
        console.log(cyan(`  ${packageManager} ${useYarn ? '' : 'run '}dev`))
        console.log('    Starts the development server.')
        console.log()
        console.log(cyan(`  ${packageManager} ${useYarn ? '' : 'run '}build`))
        console.log('    Builds the app for production.')
        console.log()
        console.log(cyan(`  ${packageManager} start`))
        console.log('    Runs the built app in production mode.')
        console.log()
        console.log('We suggest that you begin by typing:')
        console.log()
        console.log(cyan('  cd'), cdpath)
        console.log(`  ${cyan(`${packageManager} ${useYarn ? '' : 'run '}dev`)}`)
    }
    console.log()
}