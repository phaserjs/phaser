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
* @extends PIXI.Texture
* @param {Phaser.Game} game - Current game instance.
* @param {number} [width=100] - The width of the render texture.
* @param {number} [height=100] - The height of the render texture.
* @param {string} [key=''] - The key of the RenderTexture in the Cache, if stored there.
* @param {number} [scaleMode=Phaser.scaleModes.DEFAULT] - One of the Phaser.scaleModes consts.
* @param {number} [resolution=1] - The resolution of the texture being generated.
*/
Phaser.RenderTexture = function (game, width, height, key, scaleMode, resolution, renderer, textureUnit) {

    if (width === undefined) { width = 100; }
    if (height === undefined) { height = 100; }
    if (key === undefined) { key = ''; }
    if (scaleMode === undefined) { scaleMode = Phaser.scaleModes.DEFAULT; }
    if (resolution === undefined) { resolution = 1; }
    if (renderer === undefined) { renderer = PIXI.defaultRenderer; }
    if (textureUnit === undefined) { textureUnit = 0; }

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
    * @property {Phaser.Matrix} _tempMatrix - The matrix that is applied when display objects are rendered to this RenderTexture.
    * @private
    */
    this._tempMatrix = new Phaser.Matrix();

    this.width = width;
    this.height = height;
    this.resolution = resolution;

    this.frame = new Phaser.Rectangle(0, 0, this.width * this.resolution, this.height * this.resolution);

    this.crop = this.frame.clone();

    /**
     * The base texture object that this texture uses
     *
     * @property baseTexture
     * @type BaseTexture
     */
    this.baseTexture = new PIXI.BaseTexture();
    this.baseTexture.width = this.width * this.resolution;
    this.baseTexture.height = this.height * this.resolution;
    this.baseTexture._glTextures = [];
    this.baseTexture.resolution = this.resolution;

    this.baseTexture.scaleMode = scaleMode;

    this.baseTexture.hasLoaded = true;

    PIXI.Texture.call(this, this.baseTexture, this.frame.clone());

    /**
     * The renderer this RenderTexture uses. A RenderTexture can only belong to one renderer at the moment if its webGL.
     *
     * @property renderer
     * @type CanvasRenderer|WebGLRenderer
     */
    this.renderer = renderer;

    if (this.renderer.type === Phaser.WEBGL)
    {
        var gl = this.renderer.gl;
        this.baseTexture.textureIndex = textureUnit;
        this.baseTexture._dirty[gl.id] = false;

        this.textureBuffer = new PIXI.FilterTexture(gl, this.width, this.height, this.baseTexture.scaleMode, textureUnit);
        this.baseTexture._glTextures[gl.id] = this.textureBuffer.texture;

        this.projection = new Phaser.Point(this.width * 0.5, -this.height * 0.5);
    }
    else
    {
        this.textureBuffer = new PIXI.CanvasBuffer(this.width * this.resolution, this.height * this.resolution);
        this.baseTexture.source = this.textureBuffer.canvas;
    }

    /**
     * @property valid
     * @type Boolean
     */
    this.valid = true;

    this.tempMatrix = new Phaser.Matrix();

    this._updateUvs();

};

Phaser.RenderTexture.prototype = Object.create(PIXI.Texture.prototype);
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

    if (this.renderer.type === Phaser.WEBGL)
    {
        this._renderWebGL(displayObject, this._tempMatrix, clear);
    }
    else
    {
        this._renderCanvas(displayObject, this._tempMatrix, clear);
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

    if (this.renderer.type === Phaser.WEBGL)
    {
        this._renderWebGL(displayObject, this._tempMatrix, clear);
    }
    else
    {
        this._renderCanvas(displayObject, this._tempMatrix, clear);
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

    if (this.renderer.type === Phaser.WEBGL)
    {
        this._renderWebGL(displayObject, this._tempMatrix, clear);
    }
    else
    {
        this._renderCanvas(displayObject, this._tempMatrix, clear);
    }

};

/**
* Resizes the RenderTexture.
*
* @method Phaser.RenderTexture.prototype.resize
* @param {number} width - The width to resize to.
* @param {number} height - The height to resize to.
* @param {boolean} updateBase - Should the baseTexture.width and height values be resized as well?
*/
Phaser.RenderTexture.prototype.resize = function (width, height, updateBase) {

    if (width === this.width && height === this.height)
    {
        return;
    }

    this.valid = (width > 0 && height > 0);

    this.width = width;
    this.height = height;
    this.frame.width = this.crop.width = width * this.resolution;
    this.frame.height = this.crop.height = height * this.resolution;

    if (updateBase)
    {
        this.baseTexture.width = this.width * this.resolution;
        this.baseTexture.height = this.height * this.resolution;
    }

    if (this.renderer.type === Phaser.WEBGL)
    {
        this.projection.x = this.width / 2;
        this.projection.y = -this.height / 2;
    }

    if (!this.valid)
    {
        return;
    }

    this.textureBuffer.resize(this.width, this.height);

};

/**
* Clears the RenderTexture.
*
* @method Phaser.RenderTexture.prototype.clear
*/
Phaser.RenderTexture.prototype.clear = function () {

    if (!this.valid)
    {
        return;
    }

    if (this.renderer.type === Phaser.WEBGL)
    {
        this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER, this.textureBuffer.frameBuffer);
    }

    this.textureBuffer.clear();

};

/**
* This function will draw the display object to the texture.
*
* @private
* @method Phaser.RenderTexture.prototype._renderWebGL
* @param displayObject {DisplayObject} The display object to render this texture on
* @param [matrix] {Matrix} Optional matrix to apply to the display object before rendering.
* @param [clear] {Boolean} If true the texture will be cleared before the displayObject is drawn
* @private
*/
Phaser.RenderTexture.prototype._renderWebGL = function (displayObject, matrix, clear) {

    if (!this.valid || displayObject.alpha === 0)
    {
        return;
    }
   
    //  Let's create a nice matrix to apply to our display object.
    //  Frame buffers come in upside down so we need to flip the matrix.
    var wt = displayObject.worldTransform;
    wt.identity();
    wt.translate(0, this.projection.y * 2);

    if (matrix)
    {
        wt.append(matrix);
    }

    wt.scale(1, -1);

    //  Time to update all the children of the displayObject with the new matrix.
    for (var i = 0; i < displayObject.children.length; i++)
    {
        displayObject.children[i].updateTransform();
    }
    
    //  Time for the webGL fun stuff!
    var gl = this.renderer.gl;

    gl.viewport(0, 0, this.width * this.resolution, this.height * this.resolution);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.textureBuffer.frameBuffer);

    if (clear)
    {
        this.textureBuffer.clear();
    }

    this.renderer.spriteBatch.dirty = true;

    this.renderer.renderDisplayObject(displayObject, this.projection, this.textureBuffer.frameBuffer, matrix);

    this.renderer.spriteBatch.dirty = true;

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

};

/**
* This function will draw the display object to the texture.
*
* @private
* @method Phaser.RenderTexture.prototype._renderCanvas
* @param displayObject {DisplayObject} The display object to render this texture on
* @param [matrix] {Matrix} Optional matrix to apply to the display object before rendering.
* @param [clear] {Boolean} If true the texture will be cleared before the displayObject is drawn
*/
Phaser.RenderTexture.prototype._renderCanvas = function (displayObject, matrix, clear) {

    if (!this.valid || displayObject.alpha === 0)
    {
        return;
    }

    //  Let's create a nice matrix to apply to our display object.
    //  Frame buffers come in upside down so we need to flip the matrix.
    var wt = displayObject.worldTransform;
    wt.identity();

    if (matrix)
    {
        wt.append(matrix);
    }

    // Time to update all the children of the displayObject with the new matrix (what new matrix? there isn't one!)
    for (var i = 0; i < displayObject.children.length; i++)
    {
        displayObject.children[i].updateTransform();
    }

    if (clear)
    {
        this.textureBuffer.clear();
    }

    var realResolution = this.renderer.resolution;

    this.renderer.resolution = this.resolution;

    this.renderer.renderDisplayObject(displayObject, this.textureBuffer.context, matrix);

    this.renderer.resolution = realResolution;

};

/**
* Will return a HTML Image of the texture
*
* @method Phaser.RenderTexture.prototype.getImage
* @return {Image}
*/
Phaser.RenderTexture.prototype.getImage = function () {

    var image = new Image();
    image.src = this.getBase64();

    return image;

};

/**
* Will return a base64 encoded string of this texture. It works by calling RenderTexture.getCanvas and then running toDataURL on that.
*
* @method Phaser.RenderTexture.prototype.getBase64
* @return {String} A base64 encoded string of the texture.
*/
Phaser.RenderTexture.prototype.getBase64 = function () {

    return this.getCanvas().toDataURL();

};

/**
* Creates a Canvas element, renders this RenderTexture to it and then returns it.
*
* @method Phaser.RenderTexture.prototype.getCanvas
* @return {HTMLCanvasElement} A Canvas element with the texture rendered on.
*/
Phaser.RenderTexture.prototype.getCanvas = function () {

    if (this.renderer.type === Phaser.WEBGL)
    {
        var gl = this.renderer.gl;
        var width = this.textureBuffer.width;
        var height = this.textureBuffer.height;

        var webGLPixels = new Uint8Array(4 * width * height);

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.textureBuffer.frameBuffer);
        gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, webGLPixels);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        var tempCanvas = new PIXI.CanvasBuffer(width, height);
        var canvasData = tempCanvas.context.getImageData(0, 0, width, height);
        canvasData.data.set(webGLPixels);

        tempCanvas.context.putImageData(canvasData, 0, 0);

        return tempCanvas.canvas;
    }
    else
    {
        return this.textureBuffer.canvas;
    }

};
