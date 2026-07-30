/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterKey-frag.js');

/**
 * @classdesc
 * This RenderNode renders the Key filter effect.
 * See {@link Phaser.Filters.Key}.
 *
 * The Key filter removes or isolates pixels that match a specified color,
 * similar to a chroma-key (green screen) effect. It compares each pixel's
 * RGB values against the key color using vector distance, then makes matching
 * pixels transparent (or, when in isolate mode, removes everything that does
 * not match). A threshold controls how strictly pixels must match the key
 * color, and an optional feather value softens the transition at the boundary.
 *
 * @class FilterKey
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterKey = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterKey (manager)
    {
        BaseFilterShader.call(this, 'FilterKey', manager, null, ShaderSourceFS);
    },

    /**
     * Sets up the shader uniforms for the Key filter based on the current
     * state of its controller.
     *
     * Sends the key color as a `vec4` uniform (`uColor`), and packs the
     * isolate flag, threshold, and feather values into a single `vec4`
     * uniform (`uIsolateThresholdFeather`) to minimise uniform slots.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterKey#setupUniforms
     * @since 4.0.0
     * @param {Phaser.Filters.Key} controller - The Key filter controller providing the uniform values.
     * @param {Phaser.Renderer.WebGL.DrawingContext} _drawingContext - The drawing context in use (unused by this filter).
     */
    setupUniforms: function (controller, _drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('uColor', controller.color);
        programManager.setUniform('uIsolateThresholdFeather', [
            controller.isolate,
            controller.threshold,
            controller.feather
        ]);
    }
});

module.exports = FilterKey;
