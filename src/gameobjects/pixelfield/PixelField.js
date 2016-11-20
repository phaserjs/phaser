/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A PixelField is a container, with a position, rotation and scale, that renders pixels.
* So it maintains a list of pixels (just coordinates + a color), and renders with a custom batch shader.
*
* @class Phaser.GameObject.PixelField
* @extends Phaser.GameObject
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {number} [x=0] - The x coordinate of the Image. The coordinate is relative to any parent container this Image may be in.
* @param {number} [y=0] - The y coordinate of the Image. The coordinate is relative to any parent container this Image may be in.
*/
Phaser.GameObject.PixelField = function (state, x, y, pixelSize)
{
    if (pixelSize === undefined) { pixelSize = 1; }

    var _texture = state.game.textures.get('__DEFAULT');
    var _frame = new Phaser.TextureFrame(_texture, 'pixel', 0, 0, 0, pixelSize, pixelSize);

    Phaser.GameObject.call(this, state, x, y, _texture, _frame);

    /**
    * @property {number} type - The const type of this object.
    * @readonly
    */
    this.type = Phaser.PIXELFIELD;

    this.list = [];

    this.getColor32 = function (r, g, b, a)
    {
        a *= 255;

        return ((a << 24) | (b << 16) | (g << 8) | r) >>> 0;
    };

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

//  Ideas:
//
//  Pixel velocity?
//  Pixel fade (alpha out) duration?
//  Kill pixel
//  Remove pixel

Phaser.GameObject.PixelField.prototype.add = function (x, y, r, g, b, a)
{
    this.list.push({
        x: x,
        y: y,
        a: a,
        color: this.getColor32(r, g, b, a)
    });
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
