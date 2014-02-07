/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A RenderTexture is a special texture that allows any displayObject to be rendered to it.
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

    /**
    * @property {number} width - the width. 
    */
    this.width = width || 100;
    
    /**
    * @property {number} height - the height. 
    */
    this.height = height || 100;

    /**
    * @property {PIXI.Rectangle} frame - The frame for this texture. 
    */
    this.frame = new PIXI.Rectangle(0, 0, this.width, this.height);

    /**
    * @property {number} type - Base Phaser object type. 
    */
    this.type = Phaser.RENDERTEXTURE;

    // this._tempPoint = { x: 0, y: 0 };

    // if (PIXI.gl)
    // {
    //     this.initWebGL();
    // }
    // else
    // {
    //     this.initCanvas();
    // }
    
};

Phaser.RenderTexture.prototype = Object.create(PIXI.RenderTexture.prototype);
Phaser.RenderTexture.prototype.constructor = Phaser.RenderTexture;

