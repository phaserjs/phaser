/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Map = require('../../../../structs/Map.js');
var Class = require('../../../../utils/Class');
var BlendModes = require('../../../BlendModes');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterBlend-frag.js');

/**
 * @classdesc
 * This RenderNode renders the Blend filter effect, compositing the main
 * rendered texture with a secondary blend texture using a specified blend mode
 * (such as Normal, Multiply, Screen, or Overlay). The active blend mode is
 * injected into the fragment shader as a preprocessor define at draw time,
 * allowing a single shader program to support multiple compositing algorithms
 * via shader additions.
 *
 * Use this RenderNode indirectly through the {@link Phaser.Filters.Blend}
 * filter controller, which exposes the blend mode, blend texture, blend amount,
 * and tint color as configurable properties.
 *
 * See {@link Phaser.Filters.Blend}.
 *
 * @class FilterBlend
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterBlend = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterBlend (manager)
    {
        /**
         * A map from blend mode integers to their string names.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.FilterBlend#_blendModeMap
         * @type {Phaser.Structs.Map}
         * @private
         * @since 4.0.0
         */
        this._blendModeMap = new Map();

        var blendModeMap = this._blendModeMap;
        Object.entries(BlendModes).forEach(function (entry)
        {
            blendModeMap.set(entry[1], entry[0]);
        });

        var normal = blendModeMap.get(BlendModes.NORMAL);

        var additions = [
            {
                name: normal,
                additions: {
                    fragmentHeader: '#define BLEND ' + normal
                },
                tags: [ 'blendmode' ]
            }
        ];

        BaseFilterShader.call(this, 'FilterBlend', manager, null, ShaderSourceFS, additions);
    },

    /**
     * Updates the shader configuration to match the blend mode specified by
     * the filter controller. The blend mode is resolved to its string name and
     * injected into the fragment shader as a `#define BLEND` preprocessor
     * directive via a tagged shader addition. If the controller specifies
     * `SKIP_CHECK`, the blend mode falls back to `NORMAL`. If the blend mode
     * is not found in the internal map, `NORMAL` is used as a safe default.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterBlend#updateShaderConfig
     * @since 4.0.0
     * @param {Phaser.Filters.Blend} controller - The filter controller providing the blend mode.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
    updateShaderConfig: function (controller, drawingContext)
    {
        var blendMode = controller.blendMode;
        if (blendMode === BlendModes.SKIP_CHECK)
        {
            blendMode = BlendModes.NORMAL;
        }
        var name = this._blendModeMap.get(blendMode) || this._blendModeMap.get(BlendModes.NORMAL);

        var blendModeAddition = this.programManager.getAdditionsByTag('blendmode')[0];
        blendModeAddition.name = name;
        blendModeAddition.additions.fragmentHeader = '#define BLEND ' + name;
    },

    /**
     * Assigns the blend texture from the filter controller to texture slot 1.
     * The main rendered texture occupies slot 0; slot 1 is the secondary
     * texture that the fragment shader blends against using the active blend
     * mode.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterBlend#setupTextures
     * @since 4.0.0
     * @param {Phaser.Filters.Blend} controller - The filter controller providing the blend texture.
     * @param {WebGLTexture[]} textures - The texture array to populate. Index 1 is set to the blend texture.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
    setupTextures: function (controller, textures, drawingContext)
    {
        // Blend texture.
        textures[1] = controller.glTexture;
    },

    /**
     * Sets the WebGL uniforms required by the blend fragment shader:
     *
     * - `uMainSampler2` — bound to texture unit 1 (the blend texture).
     * - `amount` — the blend strength, where `0` shows only the main texture
     *   and `1` applies the full blend effect.
     * - `color` — a tint color applied to the blend texture during compositing.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterBlend#setupUniforms
     * @since 4.0.0
     * @param {Phaser.Filters.Blend} controller - The filter controller providing uniform values.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
    setupUniforms: function (controller, drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('uMainSampler2', 1);
        programManager.setUniform('amount', controller.amount);
        programManager.setUniform('color', controller.color);
    }
});

module.exports = FilterBlend;
