import { SampleWidget, SampleWidgetSettings } from "./widgets/SampleWidget";

export interface IWidgetSettings {
    widget: string
    debug: boolean
    sampleWidget: SampleWidgetSettings
    // Add more widget settings here
    // E.g.: myWidget: MyWidgetSettings
}

export const widgets = {
    'my-plugin-widgets-sample': SampleWidget,
    // Add more widgets here
    // E.g.: 'my-plugin-widgets-my-widget': MyWidget
}