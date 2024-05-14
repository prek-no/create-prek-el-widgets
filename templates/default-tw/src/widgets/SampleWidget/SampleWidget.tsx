import React, { useId } from 'react';
import styles from './SampleWidget.module.sass'
import { useWidget } from '../'
import { classNames } from '~/lib/helpers';
import { Grid, GridColumn } from '~/ui';

/* ------------------------------ *
 * Props
 * ----------------------------- */

export interface SampleWidgetSettings {
    text: string
}

export default function SampleWidget() {
    const { widgetSettings, t } = useWidget()
    const id = useId()

    /* ------------------------------ *
     * Classes
     * ----------------------------- */

    const sampleWidgetClasses = classNames(
        styles.SampleWidget
    )

    /* ------------------------------ *
     * Handlers
     * ----------------------------- */

    /* ------------------------------ *
     * Return
     * ----------------------------- */

    return (
        <div className={sampleWidgetClasses} id={id}>
            <Grid columns={2}>
                <GridColumn>
                    Your text:
                </GridColumn>
                <GridColumn>
                    { widgetSettings.sampleWidget.text }
                </GridColumn>
            </Grid>
        </div>
    )
}