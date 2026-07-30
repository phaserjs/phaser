/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterGlow-frag.js');

/**
 * @classdesc
 * A RenderNode that applies a glow effect around the edges of a Game Object
 * using a WebGL fragment shader. The glow radiates outward from the visible
 * pixels of the source texture, with configurable distance, quality, color,
 * and inner and outer strength. An optional knockout mode renders only the
 * glow itself, hiding the original image beneath it.
 *
 * This node is used internally by the {@link Phaser.Filters.Glow} filter
 * controller. The glow distance and quality are compiled into the shader as
 * preprocessor defines, so changing them causes a shader recompile. Other
 * properties are passed as uniforms and can be updated each frame without
 * recompilation.
 *
 * See {@link Phaser.Filters.Glow}.
 *
 * @class FilterGlow
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterGlow = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterGlow (manager)
    {
        var shaderAdditions = [
            {
                name: 'distance_10.0',
                additions: {
                    fragmentDefine: '#define DISTANCE 10.0'
                },
                tags: [ 'distance' ]
            },
            {
                name: 'quality_0.1',
                additions: {
                    fragmentDefine: '#define QUALITY 0.1'
                },
                tags: [ 'quality' ]
            }
        ];

        BaseFilterShader.call(this, 'FilterGlow', manager, null, ShaderSourceFS, shaderAdditions);
    },

    /**
     * Updates the shader program's preprocessor defines for glow distance and
     * quality based on the current controller values. Because these parameters
     * are baked into the shader at compile time, changing them replaces the
     * relevant shader additions and triggers a program recompile.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterGlow#updateShaderConfig
     * @since 4.0.0
     * @param {Phaser.Filters.Glow} controller - The Glow filter controller providing the distance and quality values.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
    updateShaderConfig: function (controller, drawingContext)
    {
        var programManager = this.programManager;

        var distance = controller.distance.toFixed(0) + '.0';
        var distanceAddition = programManager.getAdditionsByTag('distance')[0];
        distanceAddition.name = 'distance_' + distance;
        distanceAddition.additions.fragmentDefine = '#undef DISTANCE\n#define DISTANCE ' + distance;

        var quality = controller.quality.toFixed(0) + '.0';
        var qualityAddition = programManager.getAdditionsByTag('quality')[0];
        qualityAddition.name = 'quality_' + quality;
        qualityAddition.additions.fragmentDefine = '#undef QUALITY\n#define QUALITY ' + quality;
    },

    /**
     * Sets the WebGL shader uniforms required by the glow fragment shader.
     * This includes the render target resolution, the glow color, the outer
     * and inner glow strength, the scale factor, and the knockout flag that
     * controls whether the original image is hidden beneath the glow.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterGlow#setupUniforms
     * @since 4.0.0
     * @param {Phaser.Filters.Glow} controller - The Glow filter controller providing the uniform values.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context, used to read the render target dimensions.
     */
    setupUniforms: function (controller, drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('resolution', [ drawingContext.width, drawingContext.height ]);
        programManager.setUniform('glowColor', controller.glcolor);
        programManager.setUniform('outerStrength', controller.outerStrength);
        programManager.setUniform('innerStrength', controller.innerStrength);
        programManager.setUniform('scale', controller.scale);
        programManager.setUniform('knockout', controller.knockout);
    }
});

module.exports = FilterGlow;
