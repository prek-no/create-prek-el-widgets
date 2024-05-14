declare module '*.module.sass' {
    const value: Record<string, string>;
    export default value;
}

export type WindowWithDataLayer = Window & {
    gtag: Function;
};

declare const window: WindowWithDataLayer;