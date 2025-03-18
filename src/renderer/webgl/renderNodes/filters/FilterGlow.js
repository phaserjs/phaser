/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterGlow-frag.js');

/**
 * @classdesc
 * This RenderNode renders the Glow filter effect.
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
