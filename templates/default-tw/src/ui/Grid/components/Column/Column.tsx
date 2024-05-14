import React from 'react';
import styles from './Column.module.sass'
import {classNames, variationName} from '~/lib/helpers'

/* ------------------------------ *
 * Props
 * ----------------------------- */

type Breakpoints = 'default' | 'sm' | 'md' | 'lg' | 'xl';

type Span = {
    [Breakpoint in Breakpoints]?: number;
};

export interface ColumnProps {
    /* Column span */
    colSpan?: number | Span
    /* Row span */
    rowSpan?: number | Span
    /* Additional class names */
    className?: string
    /* Child node */
    children?: React.ReactNode;
}

export default function Column(props: ColumnProps) {
    /* ------------------------------ *
     * Initial State
     * ----------------------------- */

    const {
        colSpan = 1,
        rowSpan = 1,
        className,
        children
    } = props

    /* ------------------------------ *
     * Classes
     * ----------------------------- */

    const columnClasses = classNames(
        styles.Column,
        // Column span
        (!Number.isInteger(colSpan)) ? Object.keys(colSpan).map((key: string) => {
            // @ts-ignore
            return styles[variationName(`ColumnSpan-${key}`, colSpan[key as string] as string)]
        }) : styles[variationName('ColumnSpan', String(colSpan))],
        // Row span
        (!Number.isInteger(rowSpan)) ? Object.keys(rowSpan).map((key: string) => {
            // @ts-ignore
            return styles[variationName(`RowSpan-${key}`, rowSpan[key as string] as string)]
        }) : styles[variationName('RowSpan', String(rowSpan))],
        className
    )

    /* ------------------------------ *
     * Markup
     * ----------------------------- */

    /* ------------------------------ *
     * Return
     * ----------------------------- */

    return (
        <div className={columnClasses}>
            {children}
        </div>
    )
}
