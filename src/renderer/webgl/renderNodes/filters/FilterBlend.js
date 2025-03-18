/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Map = require('../../../../structs/Map.js');
var Class = require('../../../../utils/Class');
var BlendModes = require('../../../BlendModes');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterBlend-frag.js');

/**
 * @classdesc
 * This RenderNode renders the Blend filter effect.
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

    setupTextures: function (controller, textures, drawingContext)
    {
        // Blend texture.
        textures[1] = controller.glTexture;
    },

    setupUniforms: function (controller, drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('uMainSampler2', 1);
        programManager.setUniform('amount', controller.amount);
        programManager.setUniform('color', controller.color);
    }
});

module.exports = FilterBlend;
