/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
* @module       Phaser.RenderTexture
*/

/**
* Description of constructor.
* @class Phaser.RenderTexture
* @classdesc Description of class.
* @constructor
* @param {Phaser.Game} game - Current game instance.
* @param {string} key - Description.
* @param {number} width - Description.
* @param {number} height - Description.
*/
Phaser.RenderTexture = function (game, key, width, height) {

	/**
	* @property {Phaser.Game} game - A reference to the currently running game. 
	*/
	this.game = game;

	/**
    * @property {Description} name - Description. 
	*/
    this.name = key;

	PIXI.EventTarget.call( this );

	/**
	* @property {number} width - Description. 
    */
	this.width = width || 100;
	
	/**
	* @property {number} height - Description. 
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
