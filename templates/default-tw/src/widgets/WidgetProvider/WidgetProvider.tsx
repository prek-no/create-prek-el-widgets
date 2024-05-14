import {createContext, useContext, ReactNode, useState} from 'react';
import {useI18n} from "react-simple-i18n";
import {I18n} from "react-simple-i18n/src/context";
import { IWidgetSettings } from '~/plugin';

/* ------------------------------ *
 * Context
 * ----------------------------- */



export interface WidgetContextProps {
    widgetSettings: IWidgetSettings
    i18n: I18n
    t: (key: string, ...args: string[]) => string
}

export const WidgetContext = createContext<WidgetContextProps>(null!);

export interface WidgetProviderProps {
    settings: IWidgetSettings
    /* Child node */
    children?: ReactNode;
}

export default function WidgetProvider(props: WidgetProviderProps) {
    /* ------------------------------ *
         * Initial State
         * ----------------------------- */

    const {
        settings,
        children
    } = props

    const { t, i18n } = useI18n()

    /* ------------------------------ *
     * Handlers
     * ----------------------------- */

    /* ------------------------------ *
     * Return
     * ----------------------------- */

    return (
        <WidgetContext.Provider value={{
            widgetSettings: settings,
            i18n,
            t
        }}>
            {children}
        </WidgetContext.Provider>
    )
}

export function useWidget() {
    const context = useContext(WidgetContext);
    if (context === undefined) {
        throw new Error('useWidget must be used within a WidgetContext')
    }
    return context;
}
