/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Pre-Render Clear Event.
 *
 * This event is dispatched by the Phaser Renderer. It happens at the start of the render step, before
 * the WebGL gl.clear function has been called. This allows you to toggle the `config.clearBeforeRender` property
 * as required, to have fine-grained control over when the canvas is cleared during rendering.
 * 
 * Listen to it from within a Scene using: `this.renderer.events.on('prerenderclear', listener)`.
 * 
 * It's very important to understand that this event is called _before_ the scissor and mask stacks are cleared.
 * This means you should not use this event to modify the scissor or mask. Instead, use the `prerender` event for that.
 * 
 * If using the Canvas Renderer, this event is dispatched before the canvas is cleared, but after the context globalAlpha
 * and transform have been reset.
 *
 * @event Phaser.Renderer.Events#PRE_RENDER_CLEAR
 * @type {string}
 * @since 3.85.0
 */
module.exports = 'prerenderclear';
