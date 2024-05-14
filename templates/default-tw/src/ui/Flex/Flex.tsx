import React from 'react';
import styles from './Flex.module.sass'
import {classNames, variationName} from '~/lib/helpers'

const justifyContentValues = ["start", "end", "center", "between", "around", "evenly"] as const;
export type JustifyContent = (typeof justifyContentValues)[number];

const alignItemsValues = ["start", "end", "center", "baseline", "stretch"] as const;
export type AlignItems = (typeof alignItemsValues)[number];

export type FlexDirection = "row" | "col" | "row-reverse" | "col-reverse";

/* ------------------------------ *
 * Props
 * ----------------------------- */

type Breakpoints = 'default' | 'sm' | 'md' | 'lg' | 'xl';

type Gap = {
    [Breakpoint in Breakpoints]?: string;
};

export interface FlexProps {
    flexDirection?: FlexDirection;
    justifyContent?: JustifyContent;
    alignItems?: AlignItems;
    wrap?: boolean;
    /* Grid gap */
    gap?: number | Gap
    /* Additional class names */
    className?: string
    /* Child node */
    children?: React.ReactNode;
}

export default function Flex(props: FlexProps) {
    /* ------------------------------ *
     * Initial State
     * ----------------------------- */

    const {
        flexDirection = "row",
        justifyContent = "between",
        alignItems = "center",
        wrap = false,
        gap = 0,
        className,
        children
    } = props

    /* ------------------------------ *
     * Classes
     * ----------------------------- */

    const gapClasses = !Number.isInteger(gap) ? Object.keys(gap).map((key: string) => {
        // @ts-ignore
        const cw = gap[key as string]

        // @ts-ignore
        return key === 'default'
            ? styles[variationName('Gap', String(cw))]
            : styles[variationName(`Gap-${key}`, String(cw))]
    }) : styles[variationName('Gap', String(gap))]

    const flexClasses = classNames(
        styles.Flex,
        wrap && styles.Wrap,
        styles[variationName('Direction', flexDirection)],
        styles[variationName('Justify', justifyContent)],
        styles[variationName('ItemsAlign', alignItems)],
        gapClasses,
        className
    )

    /* ------------------------------ *
     * Markup
     * ----------------------------- */

    /* ------------------------------ *
     * Return
     * ----------------------------- */

    return (
        <div className={flexClasses}>
            {children}
        </div>
    )
}
