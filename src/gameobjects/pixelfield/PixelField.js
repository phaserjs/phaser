/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A PixelField is a container, with a position, rotation and scale, that renders pixels.
* So it maintains a list of pixels (just coordinates + a color), and renders them to the batch (maybe with a custom shader?)
*
* @class Phaser.GameObject.PixelField
* @extends Phaser.GameObject
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {number} [x=0] - The x coordinate of the Image. The coordinate is relative to any parent container this Image may be in.
* @param {number} [y=0] - The y coordinate of the Image. The coordinate is relative to any parent container this Image may be in.
* @param {string} [key] - The texture used by the Image during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture, BitmapData or PIXI.Texture.
* @param {string|number} [frame] - If this Image is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
*/
Phaser.GameObject.PixelField = function (game, x, y)
{
    this.game = game;

    Phaser.GameObject.call(this, game, x, y);

    /**
    * @property {number} type - The const type of this object.
    * @readonly
    */
    this.type = Phaser.IMAGE;
};

Phaser.GameObject.PixelField.prototype = Object.create(Phaser.GameObject.prototype);
Phaser.GameObject.PixelField.prototype.constructor = Phaser.GameObject.PixelField;

/**
* Automatically called by World.preUpdate.
*
* @method Phaser.Image#preUpdate
* @memberof Phaser.Image
*/
Phaser.GameObject.PixelField.prototype.preUpdate = function ()
{
    if (this.parent)
    {
        this.color.worldAlpha = this.parent.color.worldAlpha;
    }
};

// Phaser.GameObject.Image.prototype.update = function ()
// {
// };

// Phaser.GameObject.Image.prototype.postUpdate = function ()
// {
// };

Object.defineProperties(Phaser.GameObject.PixelField.prototype, {

    width: {

        enumerable: true,

        get: function ()
        {
            return this.transform._scaleX * this.frame.realWidth;
        },

        set: function (value)
        {
            this.scaleX = value / this.frame.realWidth;
        }

    },

    height: {

        enumerable: true,

        get: function ()
        {
            return this.transform._scaleY * this.frame.realHeight;
        },

        set: function (value)
        {
            this.scaleY = value / this.frame.realHeight;
        }

    }

});
