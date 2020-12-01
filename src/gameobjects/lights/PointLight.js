/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var GetCalcMatrix = require('../GetCalcMatrix');
var IntegerToRGB = require('../../display/color/IntegerToRGB');
var RGB = require('../../display/RGB');

/**
 * @classdesc
 *
 * TODO
 *
 * @class PointLight
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.50.0
 *
 * @extends Phaser.GameObjects.Components.AlphaSingle
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 */
var PointLight = new Class({

    Extends: GameObject,

    Mixins: [
        Components.AlphaSingle,
        Components.BlendMode,
        Components.Depth,
        Components.GetBounds,
        Components.Mask,
        Components.Pipeline,
        Components.ScrollFactor,
        Components.Transform,
        Components.Visible
    ],

    initialize:

    function PointLight (scene, x, y, color, radius, intensity, falloff)
    {
        if (color === undefined) { color = 0xffffff; }
        if (radius === undefined) { radius = 128; }
        if (intensity === undefined) { intensity = 1; }
        if (falloff === undefined) { falloff = radius * 2; }

        GameObject.call(this, scene, 'PointLight');

        this.initPipeline('PointLightPipeline');

        this.setPosition(x, y);

        var rgb = IntegerToRGB(color);

        this.color = new RGB(
            rgb.r / 255,
            rgb.g / 255,
            rgb.b / 255
        );

        this.intensity = intensity;
        this.attenuation = 0.1;

        //  read only:
        this.width = falloff * 2;
        this.height = falloff * 2;

        //  private
        this.radius = radius;
        this._falloff = falloff;
    },

    // radius: {

    //     get: function ()
    //     {
    //         return this._radius;
    //     },

    //     set: function (value)
    //     {
    //         this._radius = value;
    //     }

    // },

    falloff: {

        get: function ()
        {
            return this._falloff;
        },

        set: function (value)
        {
            this._falloff = value;

            this.width = value * 2;
            this.height = value * 2;
        }

    },

    originX: {

        get: function ()
        {
            return 0.5;
        }

    },

    originY: {

        get: function ()
        {
            return 0.5;
        }

    },

    displayOriginX: {

        get: function ()
        {
            return this._radius;
        }

    },

    displayOriginY: {

        get: function ()
        {
            return this._radius;
        }

    },

    renderWebGL: function (renderer, src, camera, parentMatrix)
    {
        var pipeline = renderer.pipelines.set(src.pipeline);

        var calcMatrix = GetCalcMatrix(src, camera, parentMatrix).calc;

        var width = src.width;
        var height = src.height;

        var x = -src._falloff;
        var y = -src._falloff;

        var xw = x + width;
        var yh = y + height;

        var lightX = calcMatrix.getX(0, 0);
        var lightY = calcMatrix.getY(0, 0);

        var tx0 = calcMatrix.getX(x, y);
        var ty0 = calcMatrix.getY(x, y);

        var tx1 = calcMatrix.getX(x, yh);
        var ty1 = calcMatrix.getY(x, yh);

        var tx2 = calcMatrix.getX(xw, yh);
        var ty2 = calcMatrix.getY(xw, yh);

        var tx3 = calcMatrix.getX(xw, y);
        var ty3 = calcMatrix.getY(xw, y);

        pipeline.batchPointLight(src, camera, tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3, lightX, lightY);
    }

});

module.exports = PointLight;
