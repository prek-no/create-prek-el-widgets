#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */

import { createPrompt } from './lib/prompt'
import { createCommand, projectPath } from './lib/commander'
import checkForUpdate from 'update-check'
import packageJson from './package.json'
import { packageManager } from './lib/commander';
import { bold, cyan, red, yellow } from 'picocolors';

createCommand.parse(process.argv)

const update = checkForUpdate(packageJson).catch(() => null)

async function notifyUpdate(): Promise<void> {
    try {
        const res = await update
        if (res?.latest) {
            const updateMessage =
            packageManager === 'yarn'
            ? 'yarn global add create-next-app'
            : packageManager === 'pnpm'
            ? 'pnpm add -g create-next-app'
            : packageManager === 'bun'
            ? 'bun add -g create-next-app'
            : 'npm i -g create-next-app'
            
            console.log(
                yellow(bold('A new version of `create-next-app` is available!')) +
                '\n' +
                'You can update by running: ' +
                cyan(updateMessage) +
                '\n'
            )
        }
        process.exit()
    } catch {
        // ignore error
    }
}

createPrompt(projectPath, createCommand)
.then(notifyUpdate)
.catch(async (reason) => {
    console.log()
    console.log('Aborting installation.')
    if (reason.command) {
        console.log(`  ${cyan(reason.command)} has failed.`)
    } else {
        console.log(
            red('Unexpected error. Please report it as a bug:') + '\n',
            reason
        )
    }
    console.log()
    
    await notifyUpdate()
    
    process.exit(1)
})