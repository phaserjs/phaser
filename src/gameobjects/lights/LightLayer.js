/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Layer = require('../layer/Layer');
var Render = require('./LightLayerRender');
var LightPipeline = require('../../renderer/webgl/pipelines/LightPipeline');
var PointLight = require('./PointLight');
var Utils = require('../../renderer/webgl/Utils');

/**
 * @classdesc
 *
 * @class LightLayer
 * @extends Phaser.GameObjects.Layer
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.50.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {Phaser.GameObjects.GameObject[]} [children] - An optional array of Game Objects to add to this Layer.
 */
var LightLayer = new Class({

    Extends: Layer,

    Mixins: [
        Render
    ],

    initialize:

    function LightLayer (scene, children)
    {
        Layer.call(this, scene, children);

        /**
         * The ambient color.
         *
         * @name Phaser.GameObjects.LightsManager#ambientColor
         * @type {{ r: number, g: number, b: number }}
         * @since 3.0.0
         */
        this.ambientColor = { r: 0.1, g: 0.1, b: 0.1 };

        // this.addPostPipeline(LightPipeline);
    },

    addPointLight: function (x, y, color, radius, intensity, falloff)
    {
        return this.add(new PointLight(this.scene, x, y, color, radius, intensity, falloff));
    },

    /**
     * Set the ambient light color.
     *
     * @method Phaser.GameObjects.LightsManager#setAmbientColor
     * @since 3.0.0
     *
     * @param {number} rgb - The integer RGB color of the ambient light.
     *
     * @return {Phaser.GameObjects.LightsManager} This Lights Manager object.
     */
    setAmbientColor: function (rgb)
    {
        var color = Utils.getFloatsFromUintRGB(rgb);

        this.ambientColor.r = color[0];
        this.ambientColor.g = color[1];
        this.ambientColor.b = color[2];

        return this;
    }

});

module.exports = LightLayer;
