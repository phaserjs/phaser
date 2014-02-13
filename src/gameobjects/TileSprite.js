/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A TileSprite is a Sprite that has a repeating texture. The texture can be scrolled and scaled and will automatically wrap on the edges as it does so.
* Please note that TileSprites have no input handler or physics bodies.
*
* @class Phaser.TileSprite
* @constructor
* @param {Phaser.Game} game - Current game instance.
* @param {number} [x=0] - X position of the new tileSprite.
* @param {number} [y=0] - Y position of the new tileSprite.
* @param {number} [width=256] - the width of the tilesprite.
* @param {number} [height=256] - the height of the tilesprite.
* @param {string|Phaser.RenderTexture|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
*/
Phaser.TileSprite = function (game, x, y, width, height, key) {

    x = x || 0;
    y = y || 0;
    width = width || 256;
    height = height || 256;
    key = key || null;

    /**
    * @property {PIXI.Texture} texture - The texture that the sprite renders with.
    */
    this.texture = PIXI.TextureCache[key];

    PIXI.TilingSprite.call(this, this.texture, width, height);

    /**
    * @property {number} type - The const type of this object.
    * @readonly
    */
    this.type = Phaser.TILESPRITE;

    this.position.x = x;
    this.position.y = y;

};

Phaser.TileSprite.prototype = Object.create(PIXI.TilingSprite.prototype);
Phaser.TileSprite.prototype.constructor = Phaser.TileSprite;
