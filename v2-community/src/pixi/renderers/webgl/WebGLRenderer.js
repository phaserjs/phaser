/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

PIXI.glContexts = []; // this is where we store the webGL contexts for easy access.
PIXI.instances = [];
PIXI._enableMultiTextureToggle = false;

/**
 * The WebGLRenderer draws the stage and all its content onto a webGL enabled canvas. This renderer
 * should be used for browsers that support webGL. This Render works by automatically managing webGLBatchs.
 * So no need for Sprite Batches or Sprite Clouds.
 * Don't forget to add the view to your DOM or you will not see anything :)
 *
 * @class WebGLRenderer
 * @constructor
 * @param game {Phaser.Game} A reference to the Phaser Game instance
 */
PIXI.WebGLRenderer = function(game) {

    /**
    * @property {Phaser.Game} game - A reference to the Phaser Game instance.
    */
    this.game = game;

    if (!PIXI.defaultRenderer)
    {
        PIXI.defaultRenderer = this;
    }

    this.extensions = {};

    /**
     * @property type
     * @type Number
     */
    this.type = Phaser.WEBGL;

    /**
     * The resolution of the renderer
     *
     * @property resolution
     * @type Number
     * @default 1
     */
    this.resolution = game.resolution;

    /**
     * Whether the render view is transparent
     *
     * @property transparent
     * @type Boolean
     */
    this.transparent = game.transparent;

    /**
     * Whether the render view should be resized automatically
     *
     * @property autoResize
     * @type Boolean
     */
    this.autoResize = false;

    /**
     * The value of the preserveDrawingBuffer flag affects whether or not the contents of the stencil buffer is retained after rendering.
     *
     * @property preserveDrawingBuffer
     * @type Boolean
     */
    this.preserveDrawingBuffer = game.preserveDrawingBuffer;

    /**
     * This sets if the WebGLRenderer will clear the context texture or not before the new render pass. If true:
     * If the Stage is NOT transparent, Pixi will clear to alpha (0, 0, 0, 0).
     * If the Stage is transparent, Pixi will clear to the target Stage's background color.
     * Disable this by setting this to false. For example: if your game has a canvas filling background image, you often don't need this set.
     *
     * @property clearBeforeRender
     * @type Boolean
     * @default
     */
    this.clearBeforeRender = game.clearBeforeRender;

    /**
     * The width of the canvas view
     *
     * @property width
     * @type Number
     */
    this.width = game.width;

    /**
     * The height of the canvas view
     *
     * @property height
     * @type Number
     */
    this.height = game.height;

    /**
     * The canvas element that everything is drawn to
     *
     * @property view
     * @type HTMLCanvasElement
     */
    this.view = game.canvas;

    /**
     * @property _contextOptions
     * @type Object
     * @private
     */
    this._contextOptions = {
        alpha: this.transparent,
        antialias: game.antialias,
        premultipliedAlpha: this.transparent && this.transparent !== 'notMultiplied',
        stencil: true,
        preserveDrawingBuffer: this.preserveDrawingBuffer
    };

    /**
     * @property projection
     * @type Point
     */
    this.projection = new PIXI.Point();

    /**
     * @property offset
     * @type Point
     */
    this.offset = new PIXI.Point();

    // time to create the render managers! each one focuses on managing a state in webGL

    /**
     * Deals with managing the shader programs and their attribs
     * @property shaderManager
     * @type WebGLShaderManager
     */
    this.shaderManager = new PIXI.WebGLShaderManager();

    /**
     * Manages the rendering of sprites
     * @property spriteBatch
     * @type WebGLSpriteBatch
     */
    this.spriteBatch = new PIXI.WebGLSpriteBatch(game);

    /**
     * Manages the masks using the stencil buffer
     * @property maskManager
     * @type WebGLMaskManager
     */
    this.maskManager = new PIXI.WebGLMaskManager();

    /**
     * Manages the filters
     * @property filterManager
     * @type WebGLFilterManager
     */
    this.filterManager = new PIXI.WebGLFilterManager();

    /**
     * Manages the stencil buffer
     * @property stencilManager
     * @type WebGLStencilManager
     */
    this.stencilManager = new PIXI.WebGLStencilManager();

    /**
     * Manages the blendModes
     * @property blendModeManager
     * @type WebGLBlendModeManager
     */
    this.blendModeManager = new PIXI.WebGLBlendModeManager();

    /**
     * @property renderSession
     * @type Object
     */
    this.renderSession = {};

    /**
     * @property currentBatchedTextures
     * @type Array
     */
    this.currentBatchedTextures = [];

    //  Needed?
    this.renderSession.game = this.game;
    this.renderSession.gl = this.gl;
    this.renderSession.drawCount = 0;
    this.renderSession.shaderManager = this.shaderManager;
    this.renderSession.maskManager = this.maskManager;
    this.renderSession.filterManager = this.filterManager;
    this.renderSession.blendModeManager = this.blendModeManager;
    this.renderSession.spriteBatch = this.spriteBatch;
    this.renderSession.stencilManager = this.stencilManager;
    this.renderSession.renderer = this;
    this.renderSession.resolution = this.resolution;

    // time init the context..
    this.initContext();

    // map some webGL blend modes..
    this.mapBlendModes();

};

// constructor
PIXI.WebGLRenderer.prototype.constructor = PIXI.WebGLRenderer;

/**
* @method initContext
*/
PIXI.WebGLRenderer.prototype.initContext = function()
{
    var gl = this.view.getContext('webgl', this._contextOptions) || this.view.getContext('experimental-webgl', this._contextOptions);

    this.gl = gl;

    if (!gl) {
        // fail, not able to get a context
        throw new Error('This browser does not support webGL. Try using the canvas renderer');
    }

    this.maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);

    this.glContextId = gl.id = PIXI.WebGLRenderer.glContextId++;

    PIXI.glContexts[this.glContextId] = gl;

    PIXI.instances[this.glContextId] = this;

    // set up the default pixi settings..
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.BLEND);

    // need to set the context for all the managers...
    this.shaderManager.setContext(gl);
    this.spriteBatch.setContext(gl);
    this.maskManager.setContext(gl);
    this.filterManager.setContext(gl);
    this.blendModeManager.setContext(gl);
    this.stencilManager.setContext(gl);

    this.renderSession.gl = this.gl;

    // now resize and we are good to go!
    this.resize(this.width, this.height);

    // Load WebGL extension
    this.extensions.compression = {};

    etc1 = gl.getExtension('WEBGL_compressed_texture_etc1') || gl.getExtension('WEBKIT_WEBGL_compressed_texture_etc1');
    pvrtc = gl.getExtension('WEBGL_compressed_texture_pvrtc') || gl.getExtension('WEBKIT_WEBGL_compressed_texture_pvrtc');
    s3tc = gl.getExtension('WEBGL_compressed_texture_s3tc') || gl.getExtension('WEBKIT_WEBGL_compressed_texture_s3tc');

    if (etc1) this.extensions.compression.ETC1 = etc1;
    if (pvrtc) this.extensions.compression.PVRTC = pvrtc;
    if (s3tc) this.extensions.compression.S3TC = s3tc;
};

/**
* If Multi Texture support has been enabled, then calling this method will enable batching on the given
* textures. The texture collection is an array of keys, that map to Phaser.Cache image entries.
*
* The number of textures that can be batched is dependent on hardware. If you provide more textures
* than can be batched by the GPU, then only those at the start of the array will be used. Generally
* you shouldn't provide more than 16 textures to this method. You can check the hardware limit via the
* `maxTextures` property.
*
* You can also check the property `currentBatchedTextures` at any time, to see which textures are currently
* being batched.
*
* To stop all textures from being batched, call this method again with an empty array.
*
* To change the textures being batched, call this method with a new array of image keys. The old ones
* will all be purged out and no-longer batched, and the new ones enabled.
* 
* Note: Throws a warning if you haven't enabled Multiple Texture batching support in the Phaser Game config.
* 
* @method setTexturePriority
* @param textureNameCollection {Array} An Array of Texture Cache keys to use for multi-texture batching.
* @return {Array} An array containing the texture keys that were enabled for batching.
*/
PIXI.WebGLRenderer.prototype.setTexturePriority = function (textureNameCollection) {

    if (!PIXI._enableMultiTextureToggle)
    {
        console.warn('setTexturePriority error: Multi Texture support hasn\'t been enabled in the Phaser Game Config.');
        return;
    }
    var clampPot = function (potSize) {
        --potSize;
        potSize |= potSize >> 1;
        potSize |= potSize >> 2;
        potSize |= potSize >> 4;
        potSize |= potSize >> 8;
        potSize |= potSize >> 16;
        return ++potSize;
    };
    var gl = this.gl;
    var maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
    var maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    var imageCache = this.game.cache._cache.image;
    var imageName = null;

    //  Clear out all previously batched textures and reset their flags.
    //  If the array has been modified, then the developer will have to
    //  deal with that in their own way.
    for (var i = 0; i < this.currentBatchedTextures.length; i++)
    {
        imageName = textureNameCollection[index];

        if (!(imageName in imageCache))
        {
            continue;
        }
        
        imageCache[imageName].base.textureIndex = 0;
    }
    var maxTextureAvailableSpace = (maxTextureSize) - clampPot(Math.max(this.width, this.height));
    this.currentBatchedTextures.length = 0;
    // We start from 1 because framebuffer texture uses unit 0.
    for (var index = 0; index < textureNameCollection.length; ++index)
    {
        imageName = textureNameCollection[index];

        if (!(imageName in imageCache))
        {
            continue;
        }
        // Unit 0 is reserved for Pixi's framebuffer
        var base = imageCache[imageName].base;
        maxTextureAvailableSpace -= clampPot(Math.max(base.width, base.height));
        if (maxTextureAvailableSpace <= 0) {
            base.textureIndex = 0;
        } else {
            base.textureIndex = (1 + (index % (maxTextures - 1)));
        }
        this.currentBatchedTextures.push(imageName);
    }

    return this.currentBatchedTextures;

};

/**
 * Renders the stage to its webGL view
 *
 * @method render
 * @param stage {Stage} the Stage element to be rendered
 */
PIXI.WebGLRenderer.prototype.render = function(stage)
{
    // no point rendering if our context has been blown up!
    if (this.contextLost)
    {
        return;
    }

    var gl = this.gl;

    // -- Does this need to be set every frame? -- //
    gl.viewport(0, 0, this.width, this.height);

    // make sure we are bound to the main frame buffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    if (this.game.clearBeforeRender)
    {
        gl.clearColor(stage._bgColor.r, stage._bgColor.g, stage._bgColor.b, stage._bgColor.a);

        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    this.offset.x = this.game.camera._shake.x;
    this.offset.y = this.game.camera._shake.y;

    this.renderDisplayObject(stage, this.projection);
};

/**
 * Renders a Display Object.
 *
 * @method renderDisplayObject
 * @param displayObject {DisplayObject} The DisplayObject to render
 * @param projection {Point} The projection
 * @param buffer {Array} a standard WebGL buffer
 */
PIXI.WebGLRenderer.prototype.renderDisplayObject = function(displayObject, projection, buffer, matrix)
{
    this.renderSession.blendModeManager.setBlendMode(PIXI.blendModes.NORMAL);

    // reset the render session data..
    this.renderSession.drawCount = 0;

    // make sure to flip the Y if using a render texture..
    this.renderSession.flipY = buffer ? -1 : 1;

    // set the default projection
    this.renderSession.projection = projection;

    //set the default offset
    this.renderSession.offset = this.offset;

    // start the sprite batch
    this.spriteBatch.begin(this.renderSession);

    // start the filter manager
    this.filterManager.begin(this.renderSession, buffer);

    // render the scene!
    displayObject._renderWebGL(this.renderSession, matrix);

    // finish the sprite batch
    this.spriteBatch.end();
};

/**
 * Resizes the webGL view to the specified width and height.
 *
 * @method resize
 * @param width {Number} the new width of the webGL view
 * @param height {Number} the new height of the webGL view
 */
PIXI.WebGLRenderer.prototype.resize = function(width, height)
{
    this.width = width * this.resolution;
    this.height = height * this.resolution;

    this.view.width = this.width;
    this.view.height = this.height;

    if (this.autoResize) {
        this.view.style.width = this.width / this.resolution + 'px';
        this.view.style.height = this.height / this.resolution + 'px';
    }

    this.gl.viewport(0, 0, this.width, this.height);

    this.projection.x =  this.width / 2 / this.resolution;
    this.projection.y =  -this.height / 2 / this.resolution;
};

/**
 * Updates and creates a WebGL compressed texture for the renderers context.
 *
 * @method updateCompressedTexture
 * @param texture {Texture} the texture to update
 * @return {boolean} True if the texture was successfully bound, otherwise false.
 */
PIXI.WebGLRenderer.prototype.updateCompressedTexture = function (texture) {
    if (!texture.hasLoaded)
    {
        return false;
    }
    var gl = this.gl;
    var textureMetaData = texture.source;

    if (!texture._glTextures[gl.id])
    {
        texture._glTextures[gl.id] = gl.createTexture();
    }
    gl.activeTexture(gl.TEXTURE0 + texture.textureIndex);

    gl.bindTexture(gl.TEXTURE_2D, texture._glTextures[gl.id]);

    gl.compressedTexImage2D(
        gl.TEXTURE_2D, 
        0, 
        textureMetaData.glExtensionFormat, 
        textureMetaData.width, 
        textureMetaData.height, 
        0, 
        textureMetaData.textureData
    );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, texture.scaleMode === PIXI.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);

    if (texture.mipmap && Phaser.Math.isPowerOfTwo(texture.width, texture.height))
    {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texture.scaleMode === PIXI.scaleModes.LINEAR ? gl.LINEAR_MIPMAP_LINEAR : gl.NEAREST_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
    }
    else
    {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texture.scaleMode === PIXI.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);
    }

    if (!texture._powerOf2)
    {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    else
    {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    }
    texture._dirty[gl.id] = false;
    return true;
};

/**
 * Updates and Creates a WebGL texture for the renderers context.
 *
 * @method updateTexture
 * @param texture {Texture} the texture to update
 * @return {boolean} True if the texture was successfully bound, otherwise false.
 */
PIXI.WebGLRenderer.prototype.updateTexture = function(texture)
{
    if (!texture.hasLoaded)
    {
        return false;
    }
    if (texture.source.compressionAlgorithm) {
        return this.updateCompressedTexture(texture);
    }

    var gl = this.gl;

    if (!texture._glTextures[gl.id])
    {
        texture._glTextures[gl.id] = gl.createTexture();
    }
    gl.activeTexture(gl.TEXTURE0 + texture.textureIndex);

    gl.bindTexture(gl.TEXTURE_2D, texture._glTextures[gl.id]);

    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.premultipliedAlpha);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.source);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, texture.scaleMode === PIXI.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);

    if (texture.mipmap && Phaser.Math.isPowerOfTwo(texture.width, texture.height))
    {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texture.scaleMode === PIXI.scaleModes.LINEAR ? gl.LINEAR_MIPMAP_LINEAR : gl.NEAREST_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
    }
    else
    {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texture.scaleMode === PIXI.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);
    }

    if (!texture._powerOf2)
    {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    else
    {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    }

    texture._dirty[gl.id] = false;

    // return texture._glTextures[gl.id];
    return true;

};

/**
 * Removes everything from the renderer (event listeners, spritebatch, etc...)
 *
 * @method destroy
 */
PIXI.WebGLRenderer.prototype.destroy = function()
{
    PIXI.glContexts[this.glContextId] = null;

    this.projection = null;
    this.offset = null;

    this.shaderManager.destroy();
    this.spriteBatch.destroy();
    this.maskManager.destroy();
    this.filterManager.destroy();

    this.shaderManager = null;
    this.spriteBatch = null;
    this.maskManager = null;
    this.filterManager = null;

    this.gl = null;
    this.renderSession = null;

    Phaser.CanvasPool.remove(this);

    PIXI.instances[this.glContextId] = null;

    PIXI.WebGLRenderer.glContextId--;
};

/**
 * Maps Pixi blend modes to WebGL blend modes.
 *
 * @method mapBlendModes
 */
PIXI.WebGLRenderer.prototype.mapBlendModes = function()
{
    var gl = this.gl;

    if (!PIXI.blendModesWebGL)
    {
        var b = [];
        var modes = PIXI.blendModes;

        b[modes.NORMAL]        = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        b[modes.ADD]           = [gl.SRC_ALPHA, gl.DST_ALPHA];
        b[modes.MULTIPLY]      = [gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA];
        b[modes.SCREEN]        = [gl.SRC_ALPHA, gl.ONE];
        b[modes.OVERLAY]       = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        b[modes.DARKEN]        = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        b[modes.LIGHTEN]       = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        b[modes.COLOR_DODGE]   = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        b[modes.COLOR_BURN]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        b[modes.HARD_LIGHT]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        b[modes.SOFT_LIGHT]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        b[modes.DIFFERENCE]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        b[modes.EXCLUSION]     = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        b[modes.HUE]           = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        b[modes.SATURATION]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        b[modes.COLOR]         = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        b[modes.LUMINOSITY]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];

        PIXI.blendModesWebGL = b;
    }
};

PIXI.WebGLRenderer.prototype.getMaxTextureUnit = function() {
    var gl = this.gl;
    return gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
};

PIXI.enableMultiTexture = function() {
    PIXI._enableMultiTextureToggle = true;
};

PIXI.WebGLRenderer.glContextId = 0;
PIXI.WebGLRenderer.textureArray = [];