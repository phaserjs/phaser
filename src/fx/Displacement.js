/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Controller = require('./Controller');
var FX_CONST = require('./const');

/**
 * @classdesc
 *
 * @class Displacement
 * @extends Phaser.FX.Controller
 * @memberof Phaser.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 * @param {string} [key='__WHITE'] - The unique string-based key of the texture to use for displacement, which must exist in the Texture Manager.
 * @param {number} [x=0.005] - The amount of horizontal displacement to apply.
 * @param {number} [y=0.005] - The amount of vertical displacement to apply.
 */
var Displacement = new Class({

    Extends: Controller,

    initialize:

    function Displacement (gameObject, displacementTexture, x, y)
    {
        if (displacementTexture === undefined) { displacementTexture = '__WHITE'; }
        if (x === undefined) { x = 0.005; }
        if (y === undefined) { y = 0.005; }

        Controller.call(this, FX_CONST.DISPLACEMENT, gameObject);

        /**
         * The amount of horizontal displacement to apply.
         *
         * @name Phaser.FX.Displacement#x
         * @type {number}
         * @since 3.60.0
         */
        this.x = x;

        /**
         * The amount of vertical displacement to apply.
         *
         * @name Phaser.FX.Displacement#y
         * @type {number}
         * @since 3.60.0
         */
        this.y = y;

        /**
         * The underlying WebGLTexture used for displacement.
         *
         * @name Phaser.FX.Displacement#glTexture
         * @type {WebGLTexture}
         * @since 3.60.0
         */
        this.glTexture;

        this.setTexture(displacementTexture);
    },

    setTexture: function (texture)
    {
        var phaserTexture = this.gameObject.scene.sys.textures.getFrame(texture);

        if (phaserTexture)
        {
            this.glTexture = phaserTexture.glTexture;
        }
    }

});

module.exports = Displacement;
