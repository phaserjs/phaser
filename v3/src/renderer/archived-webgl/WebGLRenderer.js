/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Mat Groves (@Doormat23)
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var CONST = require('../../const');
var CreateEmptyTexture = require('./utils/CreateEmptyTexture');
var QuadFBO = require('./utils/QuadFBO');
var BatchManager = require('./BatchManager');
var ShaderManager = require('./ShaderManager');

/**
* A WebgL based renderer.
*
* @class Phaser.Renderer.WebGL
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
*/
var WebGLRenderer = function (game)
{
    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = game;

    this.type = CONST.WEBGL;

    //  Read all the following from game config
    this.clearBeforeRender = true;

    this.transparent = false;

    this.autoResize = false;

    this.preserveDrawingBuffer = false;

    this.width = game.config.width * game.config.resolution;

    this.height = game.config.height * game.config.resolution;

    this.resolution = game.config.resolution;

    this.clipUnitX = 2 / this.width;

    this.clipUnitY = 2 / this.height;

    this.view = game.canvas;

    // this.stencilBufferLimit = 6;

    this.multiTexture = false;

    this.extensions = {};

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

    this.projection = { x: 0, y: 0 };

    this.offset = { x: 0, y: 0 };

    this.shaderManager = new ShaderManager(this);
    this.batch = new BatchManager(this, 4000);

    // this.filterManager = new Phaser.Renderer.WebGL.FilterManager(this);
    // this.stencilManager = new Phaser.Renderer.WebGL.StencilManager(this);

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

WebGLRenderer.prototype.constructor = WebGLRenderer;

WebGLRenderer.prototype = {

    init: function ()
    {
        this.gl = this.view.getContext('webgl', this.contextOptions) || this.view.getContext('experimental-webgl', this.contextOptions);

        if (!this.gl)
        {
            this.contextLost = true;
            throw new Error('This browser does not support WebGL. Try using the Canvas renderer.');
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

        this.emptyTexture = CreateEmptyTexture(this.gl, 1, 1, 0, 0);

        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        gl.enable(gl.BLEND);

         // Transparent
        // gl.clearColor(0, 0, 0, 0);

        //  Black
        gl.clearColor(1, 0, 0, 1);

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
            this.textureArray[i] = CreateEmptyTexture(this.gl, 1, 1, 0, i);
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
        var res = this.game.config.resolution;

        this.width = width * res;
        this.height = height * res;

        this.view.width = this.width;
        this.view.height = this.height;

        if (this.autoResize)
        {
            this.view.style.width = (this.width / res) + 'px';
            this.view.style.height = (this.height / res) + 'px';
        }

        this.gl.viewport(0, 0, this.width, this.height);

        this.clipUnitX = 2 / this.width;
        this.clipUnitY = 2 / this.height;

        this.projection.x = (this.width / 2) / res;
        this.projection.y = -(this.height / 2) / res;
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
        // console.log('%c render start ', 'color: #ffffff; background: #00ff00;');

        //  No point rendering if our context has been blown up!
        if (this.contextLost)
        {
            return;
        }

        //  Add Pre-render hook

        this.startTime = Date.now();

        var gl = this.gl;

        var fbo = state.sys.fbo;

        fbo.activate();

        //  clear is needed for the FBO, otherwise corruption ...
        gl.clear(gl.COLOR_BUFFER_BIT);

        this.setBlendMode(CONST.blendModes.NORMAL);

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

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, source.scaleMode === CONST.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);

        if (source.mipmap && source.isPowerOf2)
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, source.scaleMode === CONST.scaleModes.LINEAR ? gl.LINEAR_MIPMAP_LINEAR : gl.NEAREST_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        else
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, source.scaleMode === CONST.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);
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

    /*
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
    */

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


    createFBO: function (parent, x, y, width, height)
    {
        //   Store in a local list so we can update size if the canvas size changes?
        return new QuadFBO(this, parent, x, y, width, height);
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

        // Phaser.CanvasPool.remove(this);
    }

};

module.exports = WebGLRenderer;
