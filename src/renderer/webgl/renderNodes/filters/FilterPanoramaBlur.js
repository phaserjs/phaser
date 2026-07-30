/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterPanoramaBlur-frag.js');

/**
 * @classdesc
 * This RenderNode renders the PanoramaBlur filter effect, which applies a
 * radial blur that simulates the distortion seen at the edges of wide-angle
 * or panoramic lenses. The blur is controlled by a radius and a power value,
 * and uses configurable horizontal and vertical sample counts to balance
 * quality against performance. Higher sample counts produce smoother results
 * at the cost of GPU time.
 *
 * This node manages a dynamic shader addition that injects the sample count
 * as preprocessor defines (`SAMPLES_X` and `SAMPLES_Y`) into the fragment
 * shader, so the correct variant is compiled and cached automatically.
 *
 * See {@link Phaser.Filters.PanoramaBlur}.
 *
 * @class FilterPanoramaBlur
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterPanoramaBlur = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterPanoramaBlur (manager)
    {
        var additions = [
            {
                name: 'samples_32_16',
                additions: {
                    fragmentHeader: '#define SAMPLES_X 32.0\n#define SAMPLES_Y 16.0'
                },
                tags: [ 'samples' ]
            }
        ];

        BaseFilterShader.call(this, 'FilterPanoramaBlur', manager, null, ShaderSourceFS, additions);
    },

    /**
     * Updates the shader addition that controls the sample counts used by the
     * panorama blur fragment shader. The horizontal and vertical sample counts
     * are read from the controller and injected as `SAMPLES_X` and `SAMPLES_Y`
     * preprocessor defines, causing the program manager to compile and cache
     * the appropriate shader variant if it has not been used before.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterPanoramaBlur#updateShaderConfig
     * @since 4.0.0
     * @param {Phaser.Filters.PanoramaBlur} controller - The filter controller providing the sample count values.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context (unused by this method).
     */
    updateShaderConfig: function (controller, drawingContext)
    {
        var samplesX = controller.samplesX.toFixed(0);
        var samplesY = controller.samplesY.toFixed(0);
        var samplesAddition = this.programManager.getAdditionsByTag('samples')[0];
        samplesAddition.name = 'samples_' + samplesX + '_' + samplesY;
        samplesAddition.additions.fragmentHeader = '#define SAMPLES_X ' + samplesX + '.0\n#define SAMPLES_Y ' + samplesY + '.0';
    },

    /**
     * Sets the WebGL shader uniforms required by the panorama blur fragment
     * shader. This uploads the blur radius (`uRadius`) and the blur power
     * (`uPower`) from the filter controller to the currently active program.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterPanoramaBlur#setupUniforms
     * @since 4.0.0
     * @param {Phaser.Filters.PanoramaBlur} controller - The filter controller providing the radius and power values.
     * @param {Phaser.Renderer.WebGL.DrawingContext} _drawingContext - The current drawing context (unused by this method).
     */
    setupUniforms: function (controller, _drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('uRadius', controller.radius);
        programManager.setUniform('uPower', controller.power);
    }
});

module.exports = FilterPanoramaBlur;
