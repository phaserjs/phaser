/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A RenderTexture is a special texture that allows any displayObject to be rendered to it. It allows you to take many complex objects and
* render them down into a single quad (on WebGL) which can then be used to texture other display objects with. A way of generating textures at run-time.
* 
* @class Phaser.RenderTexture
* @constructor
* @extends PIXI.RenderTexture
* @param {Phaser.Game} game - Current game instance.
* @param {string} key - Internal Phaser reference key for the render texture.
* @param {number} [width=100] - The width of the render texture.
* @param {number} [height=100] - The height of the render texture.
* @param {string} [key=''] - The key of the RenderTexture in the Cache, if stored there.
* @param {number} [scaleMode=Phaser.scaleModes.DEFAULT] - One of the Phaser.scaleModes consts.
* @param {number} [resolution=1] - The resolution of the texture being generated.
*/
Phaser.RenderTexture = function (game, width, height, key, scaleMode, resolution) {

    if (key === undefined) { key = ''; }
    if (scaleMode === undefined) { scaleMode = Phaser.scaleModes.DEFAULT; }
    if (resolution === undefined) { resolution = 1; }

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
    * @property {PIXI.Matrix} _tempMatrix - The matrix that is applied when display objects are rendered to this RenderTexture.
    * @private
    */
    this._tempMatrix = new PIXI.Matrix();

    PIXI.RenderTexture.call(this, width, height, this.game.renderer, scaleMode, resolution);

    this.render = Phaser.RenderTexture.prototype.render;

};

Phaser.RenderTexture.prototype = Object.create(PIXI.RenderTexture.prototype);
Phaser.RenderTexture.prototype.constructor = Phaser.RenderTexture;

/**
* This function will draw the display object to the RenderTexture at the given coordinates.
*
* When the display object is drawn it takes into account scale and rotation.
*
* If you don't want those then use RenderTexture.renderRawXY instead.
*
* @method Phaser.RenderTexture.prototype.renderXY
* @param {Phaser.Sprite|Phaser.Image|Phaser.Text|Phaser.BitmapText|Phaser.Group} displayObject - The display object to render to this texture.
* @param {number} x - The x position to render the object at.
* @param {number} y - The y position to render the object at.
* @param {boolean} [clear=false] - If true the texture will be cleared before the display object is drawn.
*/
Phaser.RenderTexture.prototype.renderXY = function (displayObject, x, y, clear) {

    displayObject.updateTransform();

    this._tempMatrix.copyFrom(displayObject.worldTransform);
    this._tempMatrix.tx = x;
    this._tempMatrix.ty = y;

    if (this.renderer.type === PIXI.WEBGL_RENDERER)
    {
        this.renderWebGL(displayObject, this._tempMatrix, clear);
    }
    else
    {
        this.renderCanvas(displayObject, this._tempMatrix, clear);
    }

};

/**
* This function will draw the display object to the RenderTexture at the given coordinates.
*
* When the display object is drawn it doesn't take into account scale, rotation or translation.
*
* If you need those then use RenderTexture.renderXY instead.
*
* @method Phaser.RenderTexture.prototype.renderRawXY
* @param {Phaser.Sprite|Phaser.Image|Phaser.Text|Phaser.BitmapText|Phaser.Group} displayObject - The display object to render to this texture.
* @param {number} x - The x position to render the object at.
* @param {number} y - The y position to render the object at.
* @param {boolean} [clear=false] - If true the texture will be cleared before the display object is drawn.
*/
Phaser.RenderTexture.prototype.renderRawXY = function (displayObject, x, y, clear) {

    this._tempMatrix.identity().translate(x, y);

    if (this.renderer.type === PIXI.WEBGL_RENDERER)
    {
        this.renderWebGL(displayObject, this._tempMatrix, clear);
    }
    else
    {
        this.renderCanvas(displayObject, this._tempMatrix, clear);
    }

};

/**
* This function will draw the display object to the RenderTexture.
*
* In versions of Phaser prior to 2.4.0 the second parameter was a Phaser.Point object. 
* This is now a Matrix allowing you much more control over how the Display Object is rendered.
* If you need to replicate the earlier behavior please use Phaser.RenderTexture.renderXY instead.
*
* If you wish for the displayObject to be rendered taking its current scale, rotation and translation into account then either
* pass `null`, leave it undefined or pass `displayObject.worldTransform` as the matrix value.
*
* @method Phaser.RenderTexture.prototype.render
* @param {Phaser.Sprite|Phaser.Image|Phaser.Text|Phaser.BitmapText|Phaser.Group} displayObject - The display object to render to this texture.
* @param {Phaser.Matrix} [matrix] - Optional matrix to apply to the display object before rendering. If null or undefined it will use the worldTransform matrix of the given display object.
* @param {boolean} [clear=false] - If true the texture will be cleared before the display object is drawn.
*/
Phaser.RenderTexture.prototype.render = function (displayObject, matrix, clear) {

    if (matrix === undefined || matrix === null)
    {
        this._tempMatrix.copyFrom(displayObject.worldTransform);
    }
    else
    {
        this._tempMatrix.copyFrom(matrix);
    }

    if (this.renderer.type === PIXI.WEBGL_RENDERER)
    {
        this.renderWebGL(displayObject, this._tempMatrix, clear);
    }
    else
    {
        this.renderCanvas(displayObject, this._tempMatrix, clear);
    }

};
