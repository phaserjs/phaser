/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A dynamic initially blank canvas to which images can be drawn
* @class Phaser.RenderTexture
* @constructor
* @param {Phaser.Game} game - Current game instance.
* @param {string} key - Asset key for the render texture.
* @param {number} width - the width of the render texture.
* @param {number} height - the height of the render texture.
*/
Phaser.RenderTexture = function (game, key, width, height) {

	/**
	* @property {Phaser.Game} game - A reference to the currently running game. 
	*/
	this.game = game;

	/**
    * @property {string} name - the name of the object. 
	*/
    this.name = key;

	PIXI.EventTarget.call( this );

	/**
	* @property {number} width - the width. 
    */
	this.width = width || 100;
	
	/**
	* @property {number} height - the height. 
    */
	this.height = height || 100;

	/**
	* I know this has a typo in it, but it's because the PIXI.RenderTexture does and we need to pair-up with it
	* once they update pixi to fix the typo, we'll fix it here too :)
    * @property {Description} indetityMatrix - Description. 
 	*/
	this.indetityMatrix = PIXI.mat3.create();

	/**
	* @property {Description} frame - Description. 
    */
	this.frame = new PIXI.Rectangle(0, 0, this.width, this.height);	

	/**
	* @property {Description} type - Description. 
    */
	this.type = Phaser.RENDERTEXTURE;

	if (PIXI.gl)
	{
		this.initWebGL();
	}
	else
	{
		this.initCanvas();
	}
	
};

Phaser.RenderTexture.prototype = Phaser.Utils.extend(true, PIXI.RenderTexture.prototype);
Phaser.RenderTexture.prototype.constructor = Phaser.RenderTexture;
