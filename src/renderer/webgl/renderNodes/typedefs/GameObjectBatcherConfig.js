/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @typedef {object} Phaser.Types.Renderer.WebGL.RenderNodes.GameObjectBatcherConfig
 * @since 4.0.0
 *
 * @property {string} name - The name of the RenderNode. This should be unique within the manager.
 * @property {string|Phaser.Renderer.WebGL.RenderNodes.BatchHandler} [batchHandler='BatchHandlerQuad'] - The batch handler to which this node will send vertex information. The batch handler will be added to the manager if necessary. This is invoked during `run`. It is where shader configuration should be done.
 */
