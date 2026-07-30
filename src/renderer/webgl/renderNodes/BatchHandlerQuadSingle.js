/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var BatchHandlerQuad = require('./BatchHandlerQuad');

/**
 * @classdesc
 * BatchHandlerQuadSingle is a specialized batch handler for rendering quads
 * with a single instance per batch.
 * It extends the BatchHandlerQuad class and provides a specific configuration
 * for single-instance rendering.
 * It is used to efficiently render operations that require only a single quad,
 * specifically filters.
 * Because mobile devices often struggle with large buffer sizes,
 * this class is designed to handle the case where only one quad is needed.
 *
 * If no configuration is provided, the default values are:
 * - `name`: 'BatchHandlerQuadSingle'
 * - `shaderName`: 'STANDARD_SINGLE'
 * - `instancesPerBatch`: 1
 *
 * @class BatchHandlerQuadSingle
 * @extends Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad
 * @memberOf Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig} [config] - The configuration object for this handler.
 */
var BatchHandlerQuadSingle = new Class({
    Extends: BatchHandlerQuad,

    initialize: function BatchHandlerQuadSingle (manager, config)
    {
        if (config === undefined) { config = {}; }
        if (!config.name) { config.name = 'BatchHandlerQuadSingle'; }
        if (!config.shaderName) { config.shaderName = 'STANDARD_SINGLE'; }
        if (!config.instancesPerBatch) { config.instancesPerBatch = 1; }

        BatchHandlerQuad.call(this, manager, config);
    }
});

module.exports = BatchHandlerQuadSingle;
