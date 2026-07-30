/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Set Parallel Texture Units Event.
 *
 * This event is dispatched by the RenderNodeManager when
 * `maxParallelTextureUnits` is set after boot.
 * This advises the listener of the number of texture units
 * that should be used in parallel, for performance reasons.
 *
 * In general, the number of units is either
 * the number of texture units available on the device,
 * or 1 if the device is expected to perform badly with
 * multiple texture units in parallel.
 *
 * The primary consumer of this event is batch render nodes.
 *
 * @event Phaser.Renderer.Events#SET_PARALLEL_TEXTURE_UNITS
 * @type {string}
 * @since 4.0.0
 *
 * @param {number} units - The number of texture units advised.
 */
module.exports = 'setparalleltextureunits';
