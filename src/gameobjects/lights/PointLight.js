/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var IntegerToRGB = require('../../display/color/IntegerToRGB');
var RGB = require('../../display/RGB');

/**
 * @classdesc
 * An Image Game Object.
 *
 * An Image is a light-weight Game Object useful for the display of static images in your game,
 * such as logos, backgrounds, scenery or other non-animated elements. Images can have input
 * events and physics bodies, or be tweened, tinted or scrolled. The main difference between an
 * Image and a Sprite is that you cannot animate an Image as they do not have the Animation component.
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

    function PointLight (scene, x, y, color, radius, intensity)
    {
        if (color === undefined) { color = 0xffffff; }
        if (radius === undefined) { radius = 128; }
        if (intensity === undefined) { intensity = 10; }

        GameObject.call(this, scene, 'PointLight');

        this.initPipeline('Light2D');

        this.setPosition(x, y);

        var rgb = IntegerToRGB(color);

        this.color = new RGB(
            rgb.r / 255,
            rgb.g / 255,
            rgb.b / 255
        );

        this.intensity = intensity;

        //  read only:
        this.width = radius * 2;
        this.height = radius * 2;

        //  private
        this._radius = radius;
    },

    radius: {

        get: function ()
        {
            return this._radius;
        },

        set: function (value)
        {
            this._radius = value;
            this.width = value * 2;
            this.height = value * 2;
        }

    },

    /**
     * Internal value to allow Containers to be used for input and physics.
     * Do not change this value. It has no effect other than to break things.
     *
     * @name Phaser.GameObjects.Container#originX
     * @type {number}
     * @readonly
     * @since 3.4.0
     */
    originX: {

        get: function ()
        {
            return 0.5;
        }

    },

    /**
     * Internal value to allow Containers to be used for input and physics.
     * Do not change this value. It has no effect other than to break things.
     *
     * @name Phaser.GameObjects.Container#originY
     * @type {number}
     * @readonly
     * @since 3.4.0
     */
    originY: {

        get: function ()
        {
            return 0.5;
        }

    },

    /**
     * Internal value to allow Containers to be used for input and physics.
     * Do not change this value. It has no effect other than to break things.
     *
     * @name Phaser.GameObjects.Container#displayOriginX
     * @type {number}
     * @readonly
     * @since 3.4.0
     */
    displayOriginX: {

        get: function ()
        {
            return this._radius;
        }

    },

    /**
     * Internal value to allow Containers to be used for input and physics.
     * Do not change this value. It has no effect other than to break things.
     *
     * @name Phaser.GameObjects.Container#displayOriginY
     * @type {number}
     * @readonly
     * @since 3.4.0
     */
    displayOriginY: {

        get: function ()
        {
            return this._radius;
        }

    },

    renderWebGL: function (renderer, src, camera, parentTransformMatrix)
    {
        var pipeline = renderer.pipelines.set(this.pipeline);

        var camMatrix = pipeline._tempMatrix1;
        var lightMatrix = pipeline._tempMatrix2;
        var calcMatrix = pipeline._tempMatrix3;

        var width = src.width;
        var height = src.height;

        var x = -src.radius;
        var y = -src.radius;

        var xw = x + width;
        var yh = y + height;

        lightMatrix.applyITRS(src.x, src.y, src.rotation, src.scaleX, src.scaleY);

        camMatrix.copyFrom(camera.matrix);

        if (parentTransformMatrix)
        {
            //  Multiply the camera by the parent matrix
            camMatrix.multiplyWithOffset(parentTransformMatrix, -camera.scrollX * src.scrollFactorX, -camera.scrollY * src.scrollFactorY);

            //  Undo the camera scroll
            lightMatrix.e = src.x;
            lightMatrix.f = src.y;
        }
        else
        {
            lightMatrix.e -= camera.scrollX * src.scrollFactorX;
            lightMatrix.f -= camera.scrollY * src.scrollFactorY;
        }

        //  Multiply by the Sprite matrix, store result in calcMatrix
        camMatrix.multiply(lightMatrix, calcMatrix);

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

        this.pipeline.batchLight(src, camera, tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3, lightX, lightY);
    }

});

module.exports = PointLight;
