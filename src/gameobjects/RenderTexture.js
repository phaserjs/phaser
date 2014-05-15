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
* @param {string} [key=''] - The key of the RenderTexture in the Cache, if stored there.
* @param {number} [scaleMode=Phaser.scaleModes.DEFAULT] - One of the Phaser.scaleModes consts.
*/
Phaser.RenderTexture = function (game, width, height, key, scaleMode) {

    if (typeof key === 'undefined') { key = ''; }
    if (typeof scaleMode === 'undefined') { scaleMode = Phaser.scaleModes.DEFAULT; }

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

    /**
    * @property {Phaser.Point} _temp - Internal var.
    * @private
    */
    this._temp = new Phaser.Point();

    PIXI.RenderTexture.call(this, width, height, scaleMode);

};

Phaser.RenderTexture.prototype = Object.create(PIXI.RenderTexture.prototype);
Phaser.RenderTexture.prototype.constructor = Phaser.RenderTexture;

/**
* This function will draw the display object to the texture.
*
* @method Phaser.RenderTexture.prototype.renderXY
* @param {Phaser.Sprite|Phaser.Image|Phaser.Text|Phaser.BitmapText|Phaser.Group} displayObject  The display object to render to this texture.
* @param {number} x - The x position to render the object at.
* @param {number} y - The y position to render the object at.
* @param {boolean} clear - If true the texture will be cleared before the display object is drawn.
*/
Phaser.RenderTexture.prototype.renderXY = function (displayObject, x, y, clear) {

    this._temp.set(x, y);

    this.render(displayObject, this._temp, clear);

};

//  Documentation stubs

/**
* This function will draw the display object to the texture.
*
* @method Phaser.RenderTexture.prototype.render
* @param {Phaser.Sprite|Phaser.Image|Phaser.Text|Phaser.BitmapText|Phaser.Group} displayObject  The display object to render to this texture.
* @param {Phaser.Point} position - A Point object containing the position to render the display object at.
* @param {boolean} clear - If true the texture will be cleared before the display object is drawn.
*/

/**
* Resize this RenderTexture to the given width and height.
*
* @method Phaser.RenderTexture.prototype.resize
* @param {number} width - The new width of the RenderTexture.
* @param {number} height - The new height of the RenderTexture.
*/
