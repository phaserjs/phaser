/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterGradientMap-frag.js');
var RampGlsl = require('../../shaders/Ramp-glsl.js');

/**
 * @classdesc
 * A RenderNode that renders the GradientMap filter effect, which maps the
 * luminosity of each pixel in the source image to a corresponding color from
 * a gradient ramp texture. Darker pixels are mapped to one end of the gradient
 * and brighter pixels to the other, replacing the original colors entirely.
 * This enables stylistic effects such as thermal imaging, night vision, sepia
 * toning, or any arbitrary color grade driven by brightness.
 *
 * The gradient is defined by a {@link Phaser.Display.ColorRamp} attached to
 * the controlling {@link Phaser.Filters.GradientMap} filter. The ramp is
 * uploaded as a data texture and sampled in the fragment shader. The shader
 * variant is selected dynamically based on the ramp's band tree depth, so the
 * program is recompiled when the ramp structure changes.
 *
 * See {@link Phaser.Filters.GradientMap}.
 *
 * @class FilterGradientMap
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterGradientMap = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterGradientMap (manager)
    {
        var additions = [
            {
                name: 'RAMP_0',
                tags: 'RAMP',
                additions: {
                    fragmentHeader: RampGlsl
                }
            }
        ];

        BaseFilterShader.call(this, 'FilterGradientMap', manager, null, ShaderSourceFS, additions);
    },

    /**
     * Binds the textures required by the gradient map shader.
     * The ramp data texture, which encodes the gradient color lookup, is
     * assigned to texture slot 1. Slot 0 is reserved for the source render
     * texture and is handled by the base class.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterGradientMap#setupTextures
     * @since 4.0.0
     * @param {Phaser.Filters.GradientMap} controller - The filter controller providing the ramp data.
     * @param {WebGLTexture[]} textures - The texture array to populate for this draw call.
     * @param {Phaser.Renderer.WebGL.DrawingContext} _drawingContext - The current drawing context. Unused by this method.
     */
    setupTextures: function (controller, textures, _drawingContext)
    {
        // Ramp data texture.
        textures[1] = controller.ramp.glTexture;
    },

    /**
     * Sets all shader uniforms required by the gradient map effect. This
     * includes the ramp texture index, the ramp's data texture resolution and
     * first-band offset (used to address the correct rows in a shared ramp
     * atlas), the dither toggle, the unpremultiply flag, the tint color and
     * its blend factor, and the overall alpha value.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterGradientMap#setupUniforms
     * @since 4.0.0
     * @param {Phaser.Filters.GradientMap} controller - The filter controller providing uniform values.
     * @param {Phaser.Renderer.WebGL.DrawingContext} _drawingContext - The current drawing context. Unused by this method.
     */
    setupUniforms: function (controller, _drawingContext)
    {
        var programManager = this.programManager;

        var ramp = controller.ramp;

        programManager.setUniform('uRampTexture', 1);
        programManager.setUniform('uRampResolution', ramp.dataTextureResolution);
        programManager.setUniform('uRampBandStart', ramp.dataTextureFirstBand);
        programManager.setUniform('uDither', controller.dither);
        programManager.setUniform('uUnpremultiply', controller.unpremultiply);
        programManager.setUniform('uColor', controller.color);
        programManager.setUniform('uColorFactor', controller.colorFactor);
        programManager.setUniform('uAlpha', controller.alpha);
    },

    /**
     * Updates the shader program configuration to match the current ramp's
     * band tree depth. The RAMP shader addition's name is set to
     * `RAMP_<depth>` so the program manager can cache and retrieve the correct
     * variant, and the `BAND_TREE_DEPTH` preprocessor define in the fragment
     * shader header is rewritten accordingly. This causes the program to be
     * recompiled whenever the ramp structure changes.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterGradientMap#updateShaderConfig
     * @since 4.0.0
     * @param {Phaser.Filters.GradientMap} controller - The filter controller whose ramp provides the current band tree depth.
     * @param {Phaser.Renderer.WebGL.DrawingContext} _drawingContext - The current drawing context. Unused by this method.
     */
    updateShaderConfig: function (controller, _drawingContext)
    {
        var depth = controller.ramp.bandTreeDepth;

        var rampAddition = this.programManager.getAdditionsByTag('RAMP')[0];
        rampAddition.name = 'RAMP_' + depth;
        rampAddition.additions.fragmentHeader = RampGlsl.replace(
            '#define BAND_TREE_DEPTH 0.0',
            '#define BAND_TREE_DEPTH ' + depth + '.0'
        );
    }
});

module.exports = FilterGradientMap;
