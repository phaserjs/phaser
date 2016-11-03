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
    this.batch = new Phaser.Renderer.WebGL.BatchManager(this, 2000);

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

        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        gl.enable(gl.BLEND);
        // gl.enable(gl.DEPTH_TEST);

        gl.clearColor(0, 0.3, 0, 1);

        // this.shaderManager.init();
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

        //  Test
        this.createFramebuffer(800, 600);

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
     * Renders the stage to its webGL view
     *
     * @method render
     * @param stage {Stage} the Stage element to be rendered
     */
    render: function (stage)
    {
        //  No point rendering if our context has been blown up!
        if (this.contextLost)
        {
            return;
        }

        //  Add Pre-render hook

        this.startTime = Date.now();

        var gl = this.gl;

        //  viewport only needs to be set when the canvas is resized, not every render pass
        // gl.viewport(0, 0, this.width, this.height);

        //  Render 1/4 size view into the top left
        // gl.viewport(0, this.height / 2, this.width / 2, this.height / 2);

        //  Make sure we are bound to the main frame buffer
        // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

        //  clearColor only needs to be set once, then 'clear' picks the value up every time
        // gl.clearColor(0, 0, 0.3, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // gl.clearColor(0, 0, 0, 1);
        // gl.clear(gl.COLOR_BUFFER_BIT);

        //  Transparent
        // gl.clearColor(0, 0, 0, 0);

        //  If 'alpha' is true in the context options then
        //  things like blend mode ADD looks really weird
        //  if you don't clear the background (would look fine over a background image though)

        //  Black
        // gl.clearColor(0.4, 0, 0, 1);
        // gl.clear(gl.COLOR_BUFFER_BIT);

        this.setBlendMode(Phaser.blendModes.NORMAL);

        /*
        if (this.clearBeforeRender)
        {
            // gl.clearColor(stage._bgColor.r, stage._bgColor.g, stage._bgColor.b, stage._bgColor.a);
            gl.clearColor(0, 0.5, 0, 0);

            gl.clear(gl.COLOR_BUFFER_BIT);
        }

        // this.offset.x = this.game.camera._shake.x;
        // this.offset.y = this.game.camera._shake.y;

        this.offset.x = 0;
        this.offset.y = 0;

        this.setBlendMode(this.blendModes.NORMAL);
        */

        this.offset.x = 0;
        this.offset.y = 0;

        this.drawCount = 0;

        this.flipY = 1;

        this.batch.start(true);

        stage.render(this, stage);

        this.batch.stop();

        //  Render the whole lot again after changing the viewport
        //  It does what you'd expect, but literally draws _everything_ again!
        /*
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(400, 300, 400, 300);
        this.batch.start(true);
        stage.render(this, stage);
        this.batch.stop();
        */


        //  Draw the FBO to the main context
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // gl.clearColor(0, 0, 0, 1);
        // gl.clear(gl.COLOR_BUFFER_BIT);

        this.drawScenePostProcess();

        this.endTime = Date.now();

        // debugger;

        //  Add Post-render hook
    },

    createFramebuffer: function (width, height, scaleMode)
    {
        var gl = this.gl;

        //  Create our Quad
        this.square = {
            vbo: gl.createBuffer(),
            ibo: gl.createBuffer(),
            verticesTextureBuffer: gl.createBuffer(),
            indices: [ 0, 1, 2, 2, 1, 3 ],
            _vertices: [
                -1.0, -1.0,//0
                1.0, -1.0, //1
                -1.0, 1.0, //2
                1.0, 1.0   //3
            ],
            vertices: [
                -1.0, -1.0, // 0 = bottom-left
                1.0, -1.0,  // 1 = bottom-right
                -1.0, 1.0,  // 2 = top-left
                1.0, 1.0    // 3 = top-right
            ],
            uvs: [
                [ 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0 ]
            ]
        };

        //  ibo = indices buffer object
        //  vbo = vertices buffer object

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.square.ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.square.indices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.square.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.square.vertices), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.square.verticesTextureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.square.uvs[0]), gl.STATIC_DRAW);

        // this.frameTexture = this.createEmptyTexture(width, height, scaleMode);

        this.frameTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.frameTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        this.renderbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);

        this.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.frameTexture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderbuffer);

        var fbStatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

        if (fbStatus !== gl.FRAMEBUFFER_COMPLETE)
        {
            console.error('Incomplete GL framebuffer. ', this._fbErrors[fbStatus]);
        }

        //  Reset back to defaults
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        //  Create the quad shader

        var vertexSrc = [
            'attribute vec2 aVertexPosition;',
            'attribute vec2 aTextureCoord;',

            'varying vec2 vTextureCoord;',

            'void main(void) {',
            '   vTextureCoord = aTextureCoord;',
            '   gl_Position = vec4(aVertexPosition, 0.0, 1.0);',
            '}'
        ];

        var standardFragmentSrc = [
            'precision mediump float;',
            'uniform sampler2D uSampler;',
            'varying vec2 vTextureCoord;',

            'void main(void) {',
            '   vec4 color = texture2D(uSampler, vTextureCoord);',
            '   gl_FragColor = vec4(color.rgb, 1.0);',
            '}'
        ];

        var blurFragmentSrc = [
            'precision mediump float;',
            'uniform sampler2D uSampler;',
            'varying vec2 vTextureCoord;',

            'const float blur = 1.0 / 512.0;',

            'void main(void) {',
            '   vec4 sum = vec4(0.0);',

            '   sum += texture2D(uSampler, vec2(vTextureCoord.x - 4.0*blur, vTextureCoord.y)) * 0.05;',
            '   sum += texture2D(uSampler, vec2(vTextureCoord.x - 3.0*blur, vTextureCoord.y)) * 0.09;',
            '   sum += texture2D(uSampler, vec2(vTextureCoord.x - 2.0*blur, vTextureCoord.y)) * 0.12;',
            '   sum += texture2D(uSampler, vec2(vTextureCoord.x - blur, vTextureCoord.y)) * 0.15;',
            '   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;',
            '   sum += texture2D(uSampler, vec2(vTextureCoord.x + blur, vTextureCoord.y)) * 0.15;',
            '   sum += texture2D(uSampler, vec2(vTextureCoord.x + 2.0*blur, vTextureCoord.y)) * 0.12;',
            '   sum += texture2D(uSampler, vec2(vTextureCoord.x + 3.0*blur, vTextureCoord.y)) * 0.09;',
            '   sum += texture2D(uSampler, vec2(vTextureCoord.x + 4.0*blur, vTextureCoord.y)) * 0.05;',

            '   gl_FragColor = sum;',
            '}'
        ];

        var fragmentSrc = [
            'precision mediump float;',
            'varying vec2 vTextureCoord;',
            // 'varying vec4 vColor;',
            // 'uniform vec4 dimensions;',
            'uniform sampler2D uSampler;',

            // 'uniform float radius;',
            // 'uniform float angle;',
            // 'uniform vec2 offset;',

            'const float radius = 0.5;',
            'const float angle = 5.0;',
            'const vec2 offset = vec2(0.5, 0.5);',

            'void main(void) {',
            '   vec2 coord = vTextureCoord - offset;',
            '   float distance = length(coord);',

            '   if (distance < radius) {',
            '       float ratio = (radius - distance) / radius;',
            '       float angleMod = ratio * ratio * angle;',
            '       float s = sin(angleMod);',
            '       float c = cos(angleMod);',
            '       coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);',
            '   }',

            '   gl_FragColor = texture2D(uSampler, coord+offset);',
            '}'
        ];


        //  This compiles, attaches and links the shader
        this.postProcessShaderProgram = this.compileProgram(vertexSrc, standardFragmentSrc);

        this.postProcessShaderProgram.vertexPositionAttribute = gl.getAttribLocation(this.postProcessShaderProgram, 'aVertexPosition');
        this.postProcessShaderProgram.textureCoordAttribute = gl.getAttribLocation(this.postProcessShaderProgram, 'aTextureCoord');

    },

    drawScenePostProcess: function ()
    {
        var gl = this.gl;
        var program = this.postProcessShaderProgram;

        gl.useProgram(program);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.frameTexture);
        gl.uniform1i(gl.getUniformLocation(program, 'uSampler'), 0);

        gl.enableVertexAttribArray(program.textureCoordAttribute);
        gl.enableVertexAttribArray(program.vertexPositionAttribute);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.square.vbo); // vertex buffer object
        gl.vertexAttribPointer(program.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.square.verticesTextureBuffer); // texture buffer
        gl.vertexAttribPointer(program.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

        //  Draw

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.square.ibo); // index buffer

        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

        this.textureArray[0] = this.frameTexture;
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

    createEmptyTexture: function (width, height, scaleMode)
    {
        var gl = this.gl;

        var texture = gl.createTexture();
        var glScaleMode = (scaleMode === Phaser.scaleModes.LINEAR) ? gl.LINEAR : gl.NEAREST;

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, glScaleMode);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, glScaleMode);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        return texture;
    },

    /*
    _createFramebuffer: function (width, height, scaleMode, textureUnit)
    {
        var gl = this.gl;
        var framebuffer = gl.createFramebuffer();
        var depthStencilBuffer = gl.createRenderbuffer();
        var fsColorBuffer = null;
        var fbStatus = 0;
        
        gl.activeTexture(gl.TEXTURE0 + textureUnit);

        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.bindRenderbuffer(gl.RENDERBUFFER, depthStencilBuffer);

        //  `this.renderBuffer` = undefined? FilterTexture has a renderBuffer, but `this` doesn't.
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.renderBuffer);

        fsColorBuffer = this.createEmptyTexture(width, height, scaleMode);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fsColorBuffer, 0);

        fbStatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

        if (fbStatus !== gl.FRAMEBUFFER_COMPLETE)
        {
            console.error('Incomplete GL framebuffer. ', this._fbErrors[fbStatus]);
        }

        framebuffer.width = width;
        framebuffer.height = height;
        framebuffer.targetTexture = fsColorBuffer;
        framebuffer.renderBuffer = depthStencilBuffer;

        return framebuffer;
    },
    */

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
