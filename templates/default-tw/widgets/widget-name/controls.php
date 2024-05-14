<?php

use Elementor\Controls_Manager;
use Elementor\Widget_Base;

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
* Elementor Sample Widget
*
* @since 1.0.0
*/
class Elementor_PLUGIN_WIDGET_Controls extends Widget_Base {
    
    /**
    * Get widget name.
    *
    * @return string Widget name.
    * @since 1.0.0
    * @access public
    */
    public function get_name(): string
    {
        return PLUGIN_WIDGET_SLUG . '-sample';
    }
    
    /**
    * Get widget title.
    *
    * @return string Widget title.
    * @since 1.0.0
    * @access public
    */
    public function get_title(): string
    {
        return esc_html__('Sample Widget', PLUGIN_WIDGET_SLUG);
    }
    
    /**
    * Get widget icon.
    *
    * https://elementor.github.io/elementor-icons/
    *
    * @return string Widget icon.
    * @since 1.0.0
    * @access public
    */
    public function get_icon(): string
    {
        return 'eicon-upgrade-crown';
    }
    
    /**
    * Get custom help URL.
    *
    * Retrieve a URL where the user can get more information about the widget.
    *
    * @return string Widget help URL.
    * @since 1.0.0
    * @access public
    */
    public function get_custom_help_url(): string
    {
        return 'https://sample-url.com';
    }
    
    /**
    * Get widget categories.
    *
    * @return array Widget categories.
    * @since 1.0.0
    * @access public
    */
    public function get_categories(): array
    {
        return [PLUGIN_WIDGET_SLUG . '-category'];
    }
    
    /**
    * Get widget keywords.
    *
    * @return array Widget keywords.
    * @since 1.0.0
    * @access public
    */
    public function get_keywords(): array
    {
        return ['sample', 'widget'];
    }
    
    /**
     * Get script dependencies.
     */
    public function get_script_depends(): array
    {
        return [PLUGIN_WIDGET_SLUG];
    }
    
    /**
     * Get style dependencies.
     */
    public function get_style_depends(): array
    {
        return [PLUGIN_WIDGET_SLUG . '-css1', PLUGIN_WIDGET_SLUG . '-css2'];
    }

    /**
     * Register widget controls.
     *
     * @since 1.0.0
     * @access protected
     */
    protected function register_controls(): void
    {
        $this->start_controls_section(
            'section_general',
            [
                'label' => esc_html__('General', PLUGIN_WIDGET_SLUG),
                'tab' => Controls_Manager::TAB_CONTENT,
            ]
        );

        $this->add_control(
            'text',
            [
                'label' => esc_html__('Text', PLUGIN_WIDGET_SLUG),
                'type' => Controls_Manager::TEXTAREA,
                'ai' => [
                    'type' => 'text',
                ],
                'dynamic' => [
                    'active' => true,
                ],
                'placeholder' => esc_html__( 'Enter your text', PLUGIN_WIDGET_SLUG ),
                'default' => esc_html__( 'Add Your Text Here', PLUGIN_WIDGET_SLUG ),
            ]
        );

        $this->add_control(
            'debug',
            [
                'label' => esc_html__('Debug', PLUGIN_WIDGET_SLUG),
                'type' => Controls_Manager::SWITCHER,
                'label_on' => esc_html__( 'Yes', PLUGIN_WIDGET_SLUG ),
                'label_off' => esc_html__( 'No', PLUGIN_WIDGET_SLUG ),
                'return_value' => 'yes',
                'default' => 'no',
            ]
        );

        $this->end_controls_section();
    }
}