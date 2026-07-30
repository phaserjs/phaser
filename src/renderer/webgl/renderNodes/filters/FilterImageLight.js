/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterImageLight-frag.js');

/**
 * @classdesc
 * This RenderNode renders the ImageLight filter effect, which simulates
 * image-based lighting on a Game Object using an environment map and a normal
 * map. The environment map provides the source lighting information, while the
 * normal map describes the surface orientation of the object, allowing the
 * shader to calculate how light reflects across its surface. This produces a
 * convincing 3D lighting effect within a 2D scene.
 *
 * Use this node when a {@link Phaser.Filters.ImageLight} filter controller is
 * active on a Game Object. It binds the environment and normal textures to the
 * correct sampler slots and uploads the view matrix, model rotation, bulge, and
 * color factor uniforms required by the fragment shader.
 *
 * See {@link Phaser.Filters.ImageLight}.
 *
 * @class FilterImageLight
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterImageLight = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterImageLight (manager)
    {
        BaseFilterShader.call(this, 'FilterImageLight', manager, null, ShaderSourceFS);
    },

    /**
     * Binds the environment map and normal map WebGL textures to their
     * respective texture slots. The environment map is assigned to slot 1 and
     * the normal map to slot 2, matching the sampler uniforms set in
     * {@link Phaser.Renderer.WebGL.RenderNodes.FilterImageLight#setupUniforms}.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterImageLight#setupTextures
     * @since 4.0.0
     * @param {Phaser.Filters.ImageLight} controller - The filter controller providing the texture references.
     * @param {WebGLTexture[]} textures - The texture slot array to populate.
     * @param {Phaser.Renderer.WebGL.DrawingContext} _drawingContext - The current drawing context (unused).
     */
    setupTextures: function (controller, textures, _drawingContext)
    {
        // Environment map texture.
        textures[1] = controller.environmentGlTexture;

        // Normal map texture.
        textures[2] = controller.normalGlTexture;
    },

    /**
     * Uploads the shader uniforms required by the ImageLight fragment shader.
     * This includes the sampler indices for the environment and normal map
     * textures, the view matrix used to orient the environment map in world
     * space, the model rotation of the filtered object, the bulge factor that
     * controls the spherical distortion of the environment reflection, and the
     * color factor that blends the lighting contribution with the original
     * object color.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterImageLight#setupUniforms
     * @since 4.0.0
     * @param {Phaser.Filters.ImageLight} controller - The filter controller providing uniform values.
     * @param {Phaser.Renderer.WebGL.DrawingContext} _drawingContext - The current drawing context (unused).
     */
    setupUniforms: function (controller, _drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('uEnvSampler', 1);
        programManager.setUniform('uNormSampler', 2);
        programManager.setUniform('uViewMatrix', controller.viewMatrix.val);
        programManager.setUniform('uModelRotation', controller.getModelRotation());
        programManager.setUniform('uBulge', controller.bulge);
        programManager.setUniform('uColorFactor', controller.colorFactor);
    }
});

module.exports = FilterImageLight;
