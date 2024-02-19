/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Controller = require('./Controller');
var FX_CONST = require('./const');

/**
 * @classdesc
 * The Displacement FX Controller.
 *
 * This FX controller manages the displacement effect for a Game Object.
 *
 * The displacement effect is a visual technique that alters the position of pixels in an image
 * or texture based on the values of a displacement map. This effect is used to create the illusion
 * of depth, surface irregularities, or distortion in otherwise flat elements. It can be applied to
 * characters, objects, or backgrounds to enhance realism, convey movement, or achieve various
 * stylistic appearances.
 *
 * A Displacement effect is added to a Game Object via the FX component:
 *
 * ```js
 * const sprite = this.add.sprite();
 *
 * sprite.preFX.addDisplacement();
 * sprite.postFX.addDisplacement();
 * ```
 *
 * @class Displacement
 * @extends Phaser.FX.Controller
 * @memberof Phaser.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 * @param {string} [texture='__WHITE'] - The unique string-based key of the texture to use for displacement, which must exist in the Texture Manager.
 * @param {number} [x=0.005] - The amount of horizontal displacement to apply. A very small float number, such as 0.005.
 * @param {number} [y=0.005] - The amount of vertical displacement to apply. A very small float number, such as 0.005.
 */
var Displacement = new Class({

    Extends: Controller,

    initialize:

    function Displacement (gameObject, texture, x, y)
    {
        if (texture === undefined) { texture = '__WHITE'; }
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
         * The underlying texture used for displacement.
         *
         * @name Phaser.FX.Displacement#glTexture
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper}
         * @since 3.60.0
         */
        this.glTexture;

        this.setTexture(texture);
    },

    /**
     * Sets the Texture to be used for the displacement effect.
     *
     * You can only use a whole texture, not a frame from a texture atlas or sprite sheet.
     *
     * @method Phaser.FX.Displacement#setTexture
     * @since 3.60.0
     *
     * @param {string} [texture='__WHITE'] - The unique string-based key of the texture to use for displacement, which must exist in the Texture Manager.
     *
     * @return {this} This FX Controller.
     */
    setTexture: function (texture)
    {
        var phaserTexture = this.gameObject.scene.sys.textures.getFrame(texture);

        if (phaserTexture)
        {
            this.glTexture = phaserTexture.glTexture;
        }

        return this;
    }

});

module.exports = Displacement;
