/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
* @module       Phaser.TileSprite
*/

/**
* Create a new <code>TileSprite</code>.
* @class Phaser.Tilemap
* @classdesc Class description.
* @constructor
* @param {Phaser.Game} game - Current game instance.
* @param {object} x - Description.
* @param {object} y - Description.
* @param {number} width - Description.
* @param {number} height - Description.
* @param {string} key - Description.
* @param {Description} frame - Description.
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
