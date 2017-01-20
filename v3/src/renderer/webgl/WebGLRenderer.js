/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Mat Groves (@Doormat23)
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var CONST = require('../../const');
var CreateEmptyTexture = require('./utils/CreateEmptyTexture');
var CreateTexture2DImage = require('./utils/texture/CreateTexture2DImage');
var BlitterBatch = require('./batches/blitter/BlitterBatch');
var SpriteBatch = require('./batches/sprite/SpriteBatch');

var WebGLRenderer = function (game)
{
    this.game = game;

    this.type = CONST.WEBGL;

    this.width = game.config.width * game.config.resolution;
    this.height = game.config.height * game.config.resolution;
    this.resolution = game.config.resolution;

    this.view = game.canvas;

    //   All of these settings will be able to be controlled via the Game Config
    this.config = {
        clearBeforeRender: true,
        transparent: false,
        autoResize: false,
        preserveDrawingBuffer: false,

        WebGLContextOptions: {
            alpha: true,
            antialias: true,
            premultipliedAlpha: true,
            stencil: true,
            preserveDrawingBuffer: false
        }
    };

    this.contextLost = false;
    this.maxTextures = 1;
    this.multiTexture = false;
    this.blendModes = [];

    this.gl = null;

    this.init();

    this.blitterBatch = new BlitterBatch(game, this.gl, this);
    this.spriteBatch = new SpriteBatch(game, this.gl, this);

    this.batch = null;
    this.currentTexture2D = null;
};

WebGLRenderer.prototype.constructor = WebGLRenderer;

WebGLRenderer.prototype = {

    init: function ()
    {
        this.gl = this.view.getContext('webgl', this.config.WebGLContextOptions) || this.view.getContext('experimental-webgl', this.config.WebGLContextOptions);

        if (!this.gl)
        {
            this.contextLost = true;
            throw new Error('This browser does not support WebGL. Try using the Canvas renderer.');
        }

        var gl = this.gl;

        /*
        //  Will need supporting

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
        */

        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        gl.enable(gl.BLEND);

        gl.clearColor(1, 0, 0, 1);

        this.resize(this.width, this.height);

        /*
        //  Will need supporting

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
        */

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

    createTexture2D: function (source)
    {
        var gl = this.gl;

        if (!source.glTexture)
        {
            source.glTexture = CreateTexture2DImage(gl, source.image, gl.NEAREST, 0);
        }

        this.currentTexture2D = source.glTexture;
    },

    setTexture2D: function (texture2D)
    {
        if (this.currentTexture2D !== texture2D)
        {
            if (this.batch)
            {
                this.batch.flush();
            }

            var gl = this.gl;

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture2D);

            this.currentTexture2D = texture2D;
        }
    },

    setBatch: function (batch, texture2D)
    {
        this.setTexture2D(texture2D);

        if (this.batch !== batch)
        {
            if (this.batch)
            {
                this.batch.flush();
            }

            batch.bind();

            this.batch = batch;
        }
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

        //  Needed?
        // this.clipUnitX = 2 / this.width;
        // this.clipUnitY = 2 / this.height;

        //  Needed?
        // this.projection.x = (this.width / 2) / res;
        // this.projection.y = -(this.height / 2) / res;
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

        var gl = this.gl;

        

        //  This is the old render loop - add what you need here to replace it,
        //  but please allow each State to render to its own Quad FBO

        //var fbo = state.sys.fbo;

        //fbo.activate();

        //  clear is needed for the FBO, otherwise corruption ...
        gl.clear(gl.COLOR_BUFFER_BIT);

        //this.setBlendMode(CONST.blendModes.NORMAL);

        //this.batch.start();

        //  Could move to the State Systems or MainLoop
        for (var c = 0; c < state.sys.children.list.length; c++)
        {
            var child = state.sys.children.list[c];
            child.renderWebGL(this, child, interpolationPercentage);
            var batch = this.batch;
            if (batch.isFull())
                batch.flush();
        }
        var batch = this.batch;
        if (batch)
            batch.flush();

        //this.batch.stop();

        //  Call state.render here, so we can do some extra shizzle on the top
        //  Maybe pass in the FBO texture too?

        //fbo.render(null);

        //  Unbind the fbo texture and replace it with an empty texture.
        //  If we forget this we corrupt the main context texture!
        //  or get `RENDER WARNING: there is no texture bound to the unit 0` spam in the console
        //gl.bindTexture(gl.TEXTURE_2D, this.emptyTexture);

        

        // console.log('%c render end ', 'color: #ffffff; background: #ff0000;');

        //  Add Post-render hook
    },

    destroy: function ()
    {
        this.gl = null;
    },
    createFBO: function () {}
};

module.exports = WebGLRenderer;
