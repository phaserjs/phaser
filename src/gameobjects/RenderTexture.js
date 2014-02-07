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
* @param {string} key - Internal Phaser reference key for the render texture.
* @param {number} [width=100] - The width of the render texture.
* @param {number} [height=100] - The height of the render texture.
*/
Phaser.RenderTexture = function (game, key, width, height) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running game. 
    */
    this.game = game;

    /**
    * @property {string} key - The key of the RenderTexture in the Cache, if stored there.
    */
    this.key = key;

    /**
    * @property {number} type - Base Phaser object type. 
    */
    this.type = Phaser.RENDERTEXTURE;

    PIXI.RenderTexture.call(this, width, height, renderer);
    
};

Phaser.RenderTexture.prototype = Object.create(PIXI.RenderTexture.prototype);
Phaser.RenderTexture.prototype.constructor = Phaser.RenderTexture;
