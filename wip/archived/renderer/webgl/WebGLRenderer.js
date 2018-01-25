/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Mat Groves (@Doormat23)
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Canvas based renderer.
*
* @class Phaser.Renderer.Canvas
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
*/
Phaser.Renderer.WebGL = function (game)
{
    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = game;

    this.type = Phaser.WEBGL;

    /**
     * This sets if the CanvasRenderer will clear the canvas or not before the new render pass.
     * If the Stage is NOT transparent Pixi will use a canvas sized fillRect operation every frame to set the canvas background color.
     * If the Stage is transparent Pixi will use clearRect to clear the canvas every frame.
     * Disable this by setting this to false. For example if your game has a canvas filling background image you often don't need this set.
     *
     * @property clearBeforeRender
     * @type Boolean
     * @default
     */
    this.clearBeforeRender = game.clearBeforeRender;

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
     * The width of the canvas view
     *
     * @property width
     * @type Number
     * @default 800
     */
    this.width = game.width * game.resolution;

    /**
     * The height of the canvas view
     *
     * @property height
     * @type Number
     * @default 600
     */
    this.height = game.height * game.resolution;

    this.resolution = game.resolution;

    this.clipUnitX = 2 / this.width;

    this.clipUnitY = 2 / this.height;

    /**
     * The canvas element that everything is drawn to.
     *
     * @property view
     * @type HTMLCanvasElement
     */
    this.view = game.canvas;

    /**
     * The number of points beyond which the renderer swaps to using the Stencil Buffer to render the Graphics.
     *
     * @type {number}
     */
    this.stencilBufferLimit = 6;

    this.multiTexture = false;

    this.extensions = {};

    /**
     * The value of the preserveDrawingBuffer flag affects whether or not the contents of the stencil buffer is retained after rendering.
     *
     * @property preserveDrawingBuffer
     * @type Boolean
     */
    this.preserveDrawingBuffer = game.preserveDrawingBuffer;

    /**
     * @property _contextOptions
     * @type Object
     * @private
    this.contextOptions = {
        alpha: this.transparent,
        antialias: game.antialias,
        premultipliedAlpha: this.transparent && this.transparent !== 'notMultiplied',
        stencil: true,
        preserveDrawingBuffer: this.preserveDrawingBuffer
    };
     */

    this.contextOptions = {
        alpha: true,
        antialias: true,
        premultipliedAlpha: true,
        stencil: true,
        preserveDrawingBuffer: false
    };

    /**
     * @property projection
     * @type Point
     */
    this.projection = new Phaser.Point();

    /**
     * @property offset
     * @type Point
     */
    this.offset = new Phaser.Point();

    /**
     * Deals with managing the shader programs and their attribs
     * @property shaderManager
     * @type WebGLShaderManager
     */
    this.shaderManager = new Phaser.Renderer.WebGL.ShaderManager(this);

    /**
     * Manages the rendering of sprites
     * @property batch
     * @type WebGLSpriteBatch
     */
    this.batch = new Phaser.Renderer.WebGL.BatchManager(this, 4000);

    /**
     * Manages the filters
     * @property filterManager
     * @type WebGLFilterManager
     */
    this.filterManager = new Phaser.Renderer.WebGL.FilterManager(this);

    /**
     * Manages the stencil buffer
     * @property stencilManager
     * @type WebGLStencilManager
     */
    this.stencilManager = new Phaser.Renderer.WebGL.StencilManager(this);

    this.gl = null;

    this.emptyTexture = null;

    this.textureArray = [];

    this.currentBlendMode = -1;
    this.currentTextureSource = null;
    this.currentShader = null;

    this.blendModes = [];

    this.flipY = 1;

    this.startTime = 0;
    this.endTime = 0;
    this.drawCount = 0;

    this.contextLost = false;

    this._fbErrors = {
        36054: 'Incomplete attachment',
        36055: 'Missing attachment',
        36057: 'Incomplete dimensions',
        36061: 'Framebuffer unsupported'
    };

    this.init();

};

Phaser.Renderer.WebGL.GameObjects = {};
Phaser.Renderer.WebGL.Shaders = {};

Phaser.Renderer.WebGL.prototype.constructor = Phaser.Renderer.WebGL;

Phaser.Renderer.WebGL.prototype = {

    init: function ()
    {
        this.gl = this.view.getContext('webgl', this.contextOptions) || this.view.getContext('experimental-webgl', this.contextOptions);

        if (!this.gl)
        {
            this.contextLost = true;
            throw new Error('This browser does not support WebGL. Try using the Canvas renderer.');
        }

        //  Mixin the renderer functions
        for (var renderer in Phaser.Renderer.WebGL.GameObjects)
        {
            var types = Phaser.Renderer.WebGL.GameObjects[renderer].TYPES;

            if (!types)
            {
                continue;
            }

            for (var i = 0; i < types.length; i++)
            {
                types[i].render = Phaser.Renderer.WebGL.GameObjects[renderer].render;
            }
        }

        var gl = this.gl;

        this.maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);

        if (this.maxTextures === 1)
        {
            this.multiTexture = false;
        }
        else
        {
            this.createMultiEmptyTextures();
        }

        this.emptyTexture = this.createEmptyTexture(1, 1, 0, 0);

        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        gl.enable(gl.BLEND);

         // Transparent
        gl.clearColor(0, 0, 0, 0);

        //  Black
        // gl.clearColor(0, 0, 0, 1);

        this.shaderManager.init();
        this.batch.init();

        // this.filterManager.init();
        // this.stencilManager.init();

        this.resize(this.width, this.height);

        // Load WebGL extension
        this.extensions.compression = {};

        var etc1 = gl.getExtension('WEBGL_compressed_texture_etc1') || gl.getExtension('WEBKIT_WEBGL_compressed_texture_etc1');
        var pvrtc = gl.getExtension('WEBGL_compressed_texture_pvrtc') || gl.getExtension('WEBKIT_WEBGL_compressed_texture_pvrtc');
        var s3tc = gl.getExtension('WEBGL_compressed_texture_s3tc') || gl.getExtension('WEBKIT_WEBGL_compressed_texture_s3tc');

        if (etc1)
        {
            this.extensions.compression.ETC1 = etc1;
        }

        if (pvrtc)
        {
            this.extensions.compression.PVRTC = pvrtc;
        }

        if (s3tc)
        {
            this.extensions.compression.S3TC = s3tc;
        }

        //  Map Blend Modes

        var add = [ gl.SRC_ALPHA, gl.DST_ALPHA ];
        var normal = [ gl.ONE, gl.ONE_MINUS_SRC_ALPHA ];
        var multiply = [ gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA ];
        var screen = [ gl.SRC_ALPHA, gl.ONE ];

        this.blendModes = [
            normal, add, multiply, screen, normal,
            normal, normal, normal, normal,
            normal, normal, normal, normal,
            normal, normal, normal, normal
        ];
    },

    //  Bind empty multi-textures to avoid WebGL spam

    createMultiEmptyTextures: function ()
    {
        if (this.maxTextures === 1)
        {
            return;
        }

        for (var i = 0; i < this.maxTextures; i++)
        {
            this.textureArray[i] = this.createEmptyTexture(1, 1, 0, i);
        }
    },

    enableMultiTextureSupport: function (textureArray)
    {
        if (this.maxTextures === 1)
        {
            return;
        }

        this.multiTexture = true;

        this.batch.spriteBatch = this.batch.multiTextureBatch;

        if (Array.isArray(textureArray))
        {
            //  index 0 is reserved?
            var index = 0;

            for (var i = 0; i < textureArray.length; i++)
            {
                var texture = this.game.textures.get(textureArray[i]);

                index = texture.setTextureIndex(index);
            }
        }
    },

    disableMultiTextureSupport: function ()
    {
        this.multiTexture = false;

        this.batch.spriteBatch = this.batch.singleTextureBatch;
    },

    resize: function (width, height)
    {
        this.width = width * this.game.resolution;
        this.height = height * this.game.resolution;

        this.view.width = this.width;
        this.view.height = this.height;

        if (this.autoResize)
        {
            this.view.style.width = (this.width / this.game.resolution) + 'px';
            this.view.style.height = (this.height / this.game.resolution) + 'px';
        }

        this.gl.viewport(0, 0, this.width, this.height);

        this.clipUnitX = 2 / this.width;
        this.clipUnitY = 2 / this.height;

        this.projection.x = (this.width / 2) / this.game.resolution;
        this.projection.y = -(this.height / 2) / this.game.resolution;
    },

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
    setTexturePriority: function (textureNameCollection)
    {
        var maxTextures = this.maxTextures;
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

        this.currentBatchedTextures.length = 0;

        // We start from 1 because framebuffer texture uses unit 0.
        for (var index = 0; index < textureNameCollection.length; ++index)
        {
            imageName = textureNameCollection[index];

            if (!(imageName in imageCache))
            {
                continue;
            }

            if (index + 1 < maxTextures)
            {
                imageCache[imageName].base.textureIndex = index + 1;
            }
            else
            {
                imageCache[imageName].base.textureIndex = maxTextures - 1;
            }

            this.currentBatchedTextures.push(imageName);
        }

        return this.currentBatchedTextures;

    },



    /**
     * Renders the State.
     *
     * @method render
     * @param {Phaser.State} state - The State to be rendered.
     * @param {number} interpolationPercentage - The cumulative amount of time that hasn't been simulated yet, divided
     *   by the amount of time that will be simulated the next time update()
     *   runs. Useful for interpolating frames.
     */
    render: function (state, interpolationPercentage)
    {
        //  No point rendering if our context has been blown up!
        if (this.contextLost)
        {
            return;
        }

        // console.log('%c render start ', 'color: #ffffff; background: #00ff00;');

        //  Add Pre-render hook

        this.startTime = Date.now();

        var gl = this.gl;

        var fbo = state.sys.fbo;

        fbo.activate();

        //  clear is needed for the FBO, otherwise corruption ...
        gl.clear(gl.COLOR_BUFFER_BIT);

        this.setBlendMode(Phaser.blendModes.NORMAL);

        this.drawCount = 0;

        this.batch.start();

        //  Could move to the State Systems or MainLoop
        this.game.state.renderChildren(this, state, interpolationPercentage);

        this.batch.stop();

        //  Call state.render here, so we can do some extra shizzle on the top
        //  Maybe pass in the FBO texture too?

        fbo.render(null);

        //  Unbind the fbo texture and replace it with an empty texture.
        //  If we forget this we corrupt the main context texture!
        //  or get `RENDER WARNING: there is no texture bound to the unit 0` spam in the console
        gl.bindTexture(gl.TEXTURE_2D, this.emptyTexture);

        this.endTime = Date.now();

        // console.log('%c render end ', 'color: #ffffff; background: #ff0000;');

        //  Reset back to defaults
        // gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        // gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        //  Add Post-render hook
    },

    /**
     * With the current set-up, a multi-texture batch can render the entire scene in 1 draw and just 4 calls
     * (once the shader is loaded and bound)
     *
     * @method render
     * @param stage {Stage} the Stage element to be rendered
     */
    Tinyrender: function (stage)
    {
        //  No point rendering if our context has been blown up!
        if (this.contextLost)
        {
            return;
        }

        //  Add Pre-render hook

        this.startTime = Date.now();

        this.setBlendMode(Phaser.blendModes.NORMAL);

        this.drawCount = 0;

        this.batch.start(false);

        stage.render(this, stage);

        this.batch.stop();

        this.endTime = Date.now();

        //  Add Post-render hook
    },

    clipX: function (x)
    {
        return (this.clipUnitX * x) - 1;
    },

    clipY: function (y)
    {
        return 1 - (this.clipUnitY * y);
    },

    getVerticesFromRect: function (x, y, width, height)
    {
        // -1.0, -1.0, // 0 = bottom-left
        // 1.0, -1.0,  // 1 = bottom-right
        // -1.0, 1.0,  // 2 = top-left
        // 1.0, 1.0    // 3 = top-right

        return [
            //  bottom-left
            this.clipX(x), this.clipY(y + height),

            //  bottom-right
            this.clipX(x + width), this.clipY(y + height),

            //  top-left
            this.clipX(x), this.clipY(y),

            //  top-right
            this.clipX(x + width), this.clipY(y)
        ];
    },

    /**
    * Removes the base texture from the GPU, useful for managing resources on the GPU.
    * A texture is still 100% usable and will simply be re-uploaded if there is a sprite on screen that is using it.
    *
    * @method unloadTexture
    */
    unloadTexture: function (texture)
    {
        var gl = this.gl;

        var glTexture = texture._glTexture;

        if (gl && glTexture)
        {
            gl.deleteTexture(glTexture);
        }

        texture._glTexture = null;
        texture._dirty = false;
    },

    //  Takes a TextureSource object
    updateTexture: function (source)
    {
        if (source.compressionAlgorithm)
        {
            return this.updateCompressedTexture(source);
        }

        var gl = this.gl;

        if (!source.glTexture)
        {
            source.glTexture = gl.createTexture();
        }

        // console.log('updateTexture', source.glTextureIndex);
        // console.log(source.image.currentSrc);

        gl.activeTexture(gl.TEXTURE0 + source.glTextureIndex);

        gl.bindTexture(gl.TEXTURE_2D, source.glTexture);

        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, source.premultipliedAlpha);

        //  Throws a warning in Firefox: WebGL: texImage2D: Chosen format/type incured an expensive reformat: 0x1908/0x1401
        //  @see https://github.com/mrdoob/three.js/issues/9109
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source.image);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, source.scaleMode === Phaser.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);

        if (source.mipmap && source.isPowerOf2)
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, source.scaleMode === Phaser.scaleModes.LINEAR ? gl.LINEAR_MIPMAP_LINEAR : gl.NEAREST_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        else
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, source.scaleMode === Phaser.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);
        }

        if (source.isPowerOf2)
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        }
        else
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }

        source.glDirty = false;

        return true;
    },

    updateCompressedTexture: function (texture)
    {
        if (!texture.hasLoaded)
        {
            return false;
        }

        var gl = this.gl;
        var textureMetaData = texture.source;

        if (!texture._glTextures)
        {
            texture._glTextures = gl.createTexture();
        }

        gl.activeTexture(gl.TEXTURE0 + texture.textureIndex);

        gl.bindTexture(gl.TEXTURE_2D, texture._glTextures);

        gl.compressedTexImage2D(
            gl.TEXTURE_2D,
            0,
            textureMetaData.glExtensionFormat,
            textureMetaData.width,
            textureMetaData.height,
            0,
            textureMetaData.textureData
        );

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, texture.scaleMode === Phaser.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);

        if (texture.mipmap && Phaser.Math.isPowerOfTwo(texture.width, texture.height))
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texture.scaleMode === Phaser.scaleModes.LINEAR ? gl.LINEAR_MIPMAP_LINEAR : gl.NEAREST_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        else
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texture.scaleMode === Phaser.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);
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

        texture._dirty = false;

        return true;
    },

    //  Blend Mode Manager

    setBlendMode: function (newBlendMode)
    {
        if (this.currentBlendMode === newBlendMode)
        {
            return false;
        }
        
        var blendModeWebGL = this.blendModes[newBlendMode];

        if (blendModeWebGL)
        {
            this.currentBlendMode = newBlendMode;
    
            this.gl.blendFunc(blendModeWebGL[0], blendModeWebGL[1]);

            return true;
        }
        else
        {
            return false;
        }
    },

    //  WebGL Mask Manager

    pushMask: function (maskData)
    {
        var gl = this.gl;

        if (maskData.dirty)
        {
            // PIXI.WebGLGraphics.updateGraphics(maskData, gl);
        }

        if (maskData._webGL === undefined || maskData._webGL.data === undefined || maskData._webGL.data.length === 0)
        {
            return;
        }

        this.stencilManager.pushStencil(maskData, maskData._webGL.data[0]);
    },

    popMask: function (maskData)
    {
        if (maskData._webGL === undefined || maskData._webGL.data === undefined || maskData._webGL.data.length === 0)
        {
            return;
        }

        this.stencilManager.popStencil(maskData, maskData._webGL.data[0]);
    },

    //  Shader Utils

    //  PIXI.CompileVertexShader
    compileVertexShader: function (src)
    {
        return this.compileShader(src, this.gl.VERTEX_SHADER);
    },

    //  PIXI.CompileFragmentShader
    compileFragmentShader: function (src)
    {
        return this.compileShader(src, this.gl.FRAGMENT_SHADER);
    },

    //  PIXI._CompileShader
    compileShader: function (src, type)
    {
        if (Array.isArray(src))
        {
            src = src.join('\n');
        }

        var shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, src);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS))
        {
            console.log(this.gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    },

    //  PIXI.compileProgram
    compileProgram: function (vertexSrc, fragmentSrc)
    {
        var gl = this.gl;

        var fragmentShader = this.compileFragmentShader(fragmentSrc);
        var vertexShader = this.compileVertexShader(vertexSrc);

        var shaderProgram = gl.createProgram();

        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
        {
            console.log(gl.getProgramInfoLog(shaderProgram));
            console.log('Could not initialize shaders: Vertex & Fragment');
            console.log(vertexSrc.join('\n'));
            console.log(fragmentSrc.join('\n'));
        }

        return shaderProgram;
    },

    deleteProgram: function (program)
    {
        var gl = this.gl;

        gl.deleteProgram(program);

        return this;
    },

    createEmptyTexture: function (width, height, scaleMode, textureIndex)
    {
        var gl = this.gl;

        var texture = gl.createTexture();
        var glScaleMode = (scaleMode === Phaser.scaleModes.LINEAR) ? gl.LINEAR : gl.NEAREST;

        gl.activeTexture(gl.TEXTURE0 + textureIndex);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        //  We'll read from this texture, but it won't have mipmaps, so turn them off:
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, glScaleMode);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, glScaleMode);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        return texture;
    },

    createFBO: function (parent, x, y, width, height)
    {
        //   Store in a local list so we can update size if the canvas size changes?
        return new Phaser.Renderer.WebGL.QuadFBO(this, parent, x, y, width, height);
    },

    destroy: function ()
    {
        this.projection = null;
        this.offset = null;

        this.shaderManager.destroy();
        this.batch.destroy();
        this.maskManager.destroy();
        this.filterManager.destroy();

        this.shaderManager = null;
        this.batch = null;
        this.maskManager = null;
        this.filterManager = null;

        this.gl = null;
        this.renderSession = null;

        Phaser.CanvasPool.remove(this);
    }

};
