import { createRoot } from 'react-dom/client';
import App from "~/App";

const widgetClass = 'PLUGIN_DIRNAME-widgets'

// Render the App component into the DOM
function mount(): void | number {
    const widgets = document.querySelectorAll(`.${widgetClass}`)

    if (!widgets) {
        return setTimeout(mount, 100) as unknown as number
    }

    widgets.forEach((widget: Element, i: number) => {
        const attributes: any = widget.getAttribute('data-options')
        const attributesJSON = JSON.parse(attributes)

        const widgetSettings = {
            country: 'EN',
            ...attributesJSON
        }

        const root = createRoot(widget);
        root.render(<App widgetSettings={widgetSettings}/>);
    })
}

mount()

// @ts-ignore
if (window.elementorFrontend) {
    // @ts-ignore
    const elementorFrontend = window.elementorFrontend

    window.addEventListener('elementor/frontend/init', () => {
        elementorFrontend.hooks.addAction('frontend/element_ready/global', () => {
            mount()
        });
    });
}