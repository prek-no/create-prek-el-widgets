<?php
/**
 * Plugin Name: PLUGIN_NAME
 * Description: A plugin created by create-prek-wp-plugin.
 * Plugin URI:  https://your-plugin-url.com
 * Version:     1.0.0
 * Author:      Author Name
 * Author URI:  https://your-author-url.com
 * Text Domain: PLUGIN_DIRNAME
 *
 * Elementor tested up to: 3.21.2
 * Elementor Pro tested up to: 3.21.2
 */

 use Elementor\Elements_Manager;
 use Elementor\Widgets_Manager;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

define( 'PLUGIN_WIDGET_VERSION', '1.0.0');

const PLUGIN_WIDGET_SLUG = 'PLUGIN_DIRNAME-widgets';

/**
 * Add a new category to the Elementor widget library.
 * 
 * @param Elements_Manager $elements_manager
 * @return void
 */
function PLUGIN_LOWER_WIDGET_widgets_categories( Elements_Manager $elements_manager ): void
{
    $elements_manager->add_category(
        PLUGIN_WIDGET_SLUG . '-category',
        [
            'title' => esc_html__('PLUGIN_NAME', 'PLUGIN_DIRNAME'),
            'icon' => 'fa fa-plug',
        ]
    );
}
add_action( 'elementor/elements/categories_registered', 'PLUGIN_LOWER_WIDGET_widgets_categories' );

/**
 * Register Widgets
 *
 * @param Widgets_Manager $widgets_manager Elementor widgets manager.
 * @return void
 * @since 1.0.0
 */
function register_PLUGIN_LOWER_WIDGET_widgets( Widgets_Manager $widgets_manager ): void
{
    require_once( __DIR__ . '/widgets/PLUGIN_DIRNAME-widget/widget.php' );

    $widgets_manager->register( new Elementor_PLUGIN_WIDGET_Widget() );
}
add_action( 'elementor/widgets/register', 'register_PLUGIN_LOWER_WIDGET_widgets' );

/**
 * Register scripts and styles for Elementor test widgets.
 */
function PLUGIN_LOWER_WIDGET_widgets_dependencies(): void {
    $asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

    /* Scripts */
    wp_register_script(PLUGIN_WIDGET_SLUG, plugin_dir_url( __FILE__ ) . 'build/index.js', $asset_file['dependencies'], $asset_file['version'], true );
    wp_localize_script(PLUGIN_WIDGET_SLUG, 'pluginData', [
        'ajaxUrl' => admin_url('admin-ajax.php')
    ]);

    /* Styles */
    wp_register_style( PLUGIN_WIDGET_SLUG. '-css1', plugin_dir_url( __FILE__ ) . 'build/index.css', [], $asset_file['version'] );
    wp_register_style( PLUGIN_WIDGET_SLUG. '-css2', plugin_dir_url( __FILE__ ) . 'build/main.css', [], $asset_file['version'] );
}

add_action( 'wp_enqueue_scripts', 'PLUGIN_LOWER_WIDGET_widgets_dependencies' );

/**
 * Add type="module" to the script tag.
 */
add_filter('script_loader_tag', function($tag, $handle, $src) {
    // if not your script, do nothing and return original $tag
    if ( PLUGIN_WIDGET_SLUG !== $handle ) {
        return $tag;
    }
    // change the script tag by adding type="module" and return it.
    return '<script type="module" src="' . esc_url( $src ) . '"></script>';
}, 10, 3);