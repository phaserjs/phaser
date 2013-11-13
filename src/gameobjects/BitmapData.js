/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Creates a new `BitmapData` object.
*
* @class Phaser.BitmapData
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {string} [key] - A key the BitmapData will use when added to the Phaser.Cache. If none is given a UUID is generated.
* @param {number} [width=256] - The width of the BitmapData in pixels.
* @param {number} [height=256] - The height of the BitmapData in pixels.
*/
Phaser.BitmapData = function (game, key, width, height) {

	if (typeof key === 'undefined') { key = 'bitmapData' . game.rnd.uuid(); }
	if (typeof width === 'undefined') { width = 256; }
	if (typeof height === 'undefined') { height = 256; }

	/**
	* @property {Phaser.Game} game - A reference to the currently running game. 
	*/
	this.game = game;

	/**
    * @property {string} name - The name of the BitmapData.
	*/
    this.name = key;

	/**
	* @property {number} width - The width of the BitmapData in pixels.
    */
	this.width = width;
	
	/**
	* @property {number} height - The height of the BitmapData in pixels.
    */
	this.height = height;

	/**
	* @property {HTMLCanvasElement} canvas - The canvas to which this BitmapData draws.
	* @default
	*/
    this.canvas = Phaser.Canvas.create(width, height);
    
	/**
	* @property {HTMLCanvasContextElement} context - The 2d context of the canvas.
	* @default
	*/
    this.context = this.canvas.getContext('2d');
    
	/**
	* @property {PIXI.BaseTexture} baseTexture - The PIXI.BaseTexture.
	* @default
	*/
    this.baseTexture = new PIXI.BaseTexture(this.canvas);
    
	/**
	* @property {PIXI.Texture} texture - The PIXI.Texture.
	* @default
	*/
    this.texture = new PIXI.Texture(this.baseTexture);
    
	/**
	* @property {Phaser.Frame} textureFrame - The Frame this BitmapData uses for rendering.
	* @default
	*/
    this.textureFrame = new Phaser.Frame(0, 0, 0, width, height, 'bitmapData', game.rnd.uuid());

    /**
	* @property {number} type - The const type of this object.
    * @default
	*/
    this.type = Phaser.BITMAPDATA;

}

Phaser.BitmapData.prototype = {

	clear: function () {

	    this.context.clearRect(0, 0, this.width, this.height);

	},

	render: function () {

	    //  Only needed if running in WebGL, otherwise this array will never get cleared down I don't think!
	    if (this.game.renderType == Phaser.WEBGL)
	    {
	        PIXI.texturesToUpdate.push(this.baseTexture);
	    }

	}

}

