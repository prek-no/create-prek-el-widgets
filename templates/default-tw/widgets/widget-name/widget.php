<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

require_once __DIR__ . '/controls.php';

/**
* Elementor Sample Widget
*
* @since 1.0.0
*/
class Elementor_PLUGIN_WIDGET_Widget extends Elementor_PLUGIN_WIDGET_Controls {
    /**
     * Render the widget output on the frontend.
     */
    protected function render(): void
    {
        $settings = $this->get_settings_for_display();

        $options = [
            'widget' => $this->get_name(),
            'debug' => isset($settings['debug']) ? $settings['debug'] === 'yes' : false,
            'sampleWidget' => [
                'text' => $settings['text'],
            ]
        ];
        ?>
        <script type="text/javascript">
            window.ajaxUrl = "<?php echo admin_url('admin-ajax.php'); ?>";
        </script>
        <div
                id="<?php echo $this->get_name(); ?>"
                class="<?php echo PLUGIN_WIDGET_SLUG; ?>"
                data-options="<?php echo htmlspecialchars(json_encode($options), ENT_QUOTES, 'UTF-8'); ?>"
        ></div>
        <?php
    }

    protected function content_template()
    {
        ?>
        <#
        const options = {
            widget: settings.widget,
            debug: settings.debug === 'yes',
            sampleWidget: {
                text: settings.text,
            }   
        };
        #>
        <div 
            id='{{{ settings.widget }}}'
            class="<?php echo PLUGIN_WIDGET_SLUG; ?>" 
            data-options='{{{ JSON.stringify(options) }}}'
        >
            Refresh
        </div>
        <?php
    }
}