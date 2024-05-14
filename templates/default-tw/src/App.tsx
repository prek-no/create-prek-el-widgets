import { WidgetProvider } from "~/widgets";
import {createI18n, I18nProvider} from "react-simple-i18n";
import {langData} from "~/locale";
import { widgets } from "./plugin";
import { IWidgetSettings } from "./plugin";

interface AppProps {
    widgetSettings: IWidgetSettings
}

const App = (props: AppProps) => {
    const {
        widgetSettings
    } = props

    return (
        <I18nProvider i18n={createI18n(langData, { lang: 'en' })}>
            <WidgetProvider settings={widgetSettings}>
                { Object.keys(widgets).map((widget: string) => {
                    if (widgetSettings.widget !== widget) {
                        return null
                    }

                    // @ts-ignore
                    const Widget = widgets[widget]
                    return <Widget key={widget}/>
                }) }
            </WidgetProvider>
        </I18nProvider>
    );
}

export default App
