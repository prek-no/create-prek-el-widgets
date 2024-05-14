import React, {forwardRef} from 'react';
import styles from './Grid.module.sass'
import {classNames, variationName} from '~/lib/helpers'

/* ------------------------------ *
 * Props
 * ----------------------------- */

type Breakpoints = 'default' | 'sm' | 'md' | 'lg' | 'xl';

type Columns = {
    [Breakpoint in Breakpoints]?: number;
};

type Gap = {
    [Breakpoint in Breakpoints]?: string;
};

export interface GridProps {
    /* Number of columns */
    columns?: number | Columns
    /* Number of rows */
    rows?: number | Columns
    /* Grid gap */
    gap?: number | Gap
    /* Additional class names */
    className?: string
    /* Child node */
    children?: React.ReactNode
}

export const Grid = forwardRef<HTMLDivElement, GridProps>((props: GridProps, ref) => {
    /* ------------------------------ *
     * Initial State
     * ----------------------------- */

    const {
        columns = 1,
        rows = 1,
        gap = 1,
        className,
        children
    } = props

    /* ------------------------------ *
     * Classes
     * ----------------------------- */

    const columnClasses = !Number.isInteger(columns) ? Object.keys(columns).map((key: string) => {
        // @ts-ignore
        const cw = columns[key as string]

        // @ts-ignore
        return key === 'default'
            ? styles[variationName('Columns', String(cw))]
            : styles[variationName(`Columns-${key}`, String(cw))]
    }) : styles[variationName('Columns', String(columns))]

    const rowClasses = !Number.isInteger(rows) ? Object.keys(rows).map((key: string) => {
        // @ts-ignore
        const cw = rows[key as string]

        // @ts-ignore
        return key === 'default'
            ? styles[variationName('Rows', String(cw))]
            : styles[variationName(`Rows-${key}`, String(cw))]
    }) : styles[variationName('Rows', String(rows))]

    const gapClasses = !Number.isInteger(gap) ? Object.keys(gap).map((key: string) => {
        // @ts-ignore
        const cw = gap[key as string]

        // @ts-ignore
        return key === 'default'
            ? styles[variationName('Gap', String(cw))]
            : styles[variationName(`Gap-${key}`, String(cw))]
    }) : styles[variationName('Gap', String(gap))]

    const gridClasses = classNames(
        styles.Grid,
        // Columns
        columnClasses,
        // Rows
        rowClasses,
        // Gap
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
        <div
            ref={ref}
            className={gridClasses}
        >
            {children}
        </div>
    )
});

export default Grid
