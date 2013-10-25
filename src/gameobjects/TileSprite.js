/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Create a new <code>TileSprite</code>.
* @class Phaser.Tilemap
* @constructor
* @param {Phaser.Game} game - Current game instance.
* @param {number} x - X position of the new tileSprite.
* @param {number} y - Y position of the new tileSprite.
* @param {number} width - the width of the tilesprite.
* @param {number} height - the height of the tilesprite.
* @param {string|Phaser.RenderTexture|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
* @param {string|number} frame - If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
*/
Phaser.TileSprite = function (game, x, y, width, height, key, frame) {

    x = x || 0;
    y = y || 0;
    width = width || 256;
    height = height || 256;
    key = key || null;
    frame = frame || null;

	Phaser.Sprite.call(this, game, x, y, key, frame);

	/**
	* @property {Description} texture - Description. 
    */
    this.texture = PIXI.TextureCache[key];

	PIXI.TilingSprite.call(this, this.texture, width, height);

	/**
	* @property {Description} type - Description. 
    */
	this.type = Phaser.TILESPRITE;

	/**
	* @property {Point} tileScale - The scaling of the image that is being tiled.
	*/	
	this.tileScale = new Phaser.Point(1, 1);

	/**
	* @property {Point} tilePosition - The offset position of the image that is being tiled.
	*/	
	this.tilePosition = new Phaser.Point(0, 0);

};

Phaser.TileSprite.prototype = Phaser.Utils.extend(true, PIXI.TilingSprite.prototype, Phaser.Sprite.prototype);
Phaser.TileSprite.prototype.constructor = Phaser.TileSprite;

//  Add our own custom methods
