/**
* @author       Richard Davey (@photonstorm)
* @author       Felipe Alfonso (@bitnenfer)
* @copyright    2017 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var CONST = require('../../const');
var CreateEmptyTexture = require('./utils/CreateEmptyTexture');
var CreateTexture2DImage = require('./utils/texture/CreateTexture2DImage');
var BlitterBatch = require('./batches/blitter/BlitterBatch');
var AAQuadBatch = require('./batches/aaquad/AAQuadBatch');
var SpriteBatch = require('./batches/sprite/SpriteBatch');
var BlendModes = require('../BlendModes');

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
    this.extensions = null;
    this.batches = [];
    this.blitterBatch = null;
    this.aaQuadBatch = null;
    this.spriteBatch = null;
    this.batch = null;
    this.currentTexture2D = null;

    this.init();
};

WebGLRenderer.prototype.constructor = WebGLRenderer;

WebGLRenderer.prototype = {

    init: function ()
    {
        console.log('WebGLRenderer.init');

        this.gl = this.view.getContext('webgl', this.config.WebGLContextOptions) || this.view.getContext('experimental-webgl', this.config.WebGLContextOptions);

        if (!this.gl)
        {
            this.contextLost = true;
            throw new Error('This browser does not support WebGL. Try using the Canvas renderer.');
        }

        var gl = this.gl;
        var color = this.game.config.backgroundColor;
    
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        gl.enable(gl.BLEND);
        gl.clearColor(color.redGL, color.greenGL, color.blueGL, color.alphaGL);

        this.resize(this.width, this.height);

        //  Map Blend Modes

        var add = [ gl.SRC_ALPHA, gl.DST_ALPHA ];
        var normal = [ gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA ];
        var multiply = [ gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA ];
        var screen = [ gl.SRC_ALPHA, gl.ONE ];

        this.blendModes = [
            normal, add, multiply, screen, normal,
            normal, normal, normal, normal,
            normal, normal, normal, normal,
            normal, normal, normal, normal
        ];

        this.blendMode = -1;
        this.extensions = gl.getSupportedExtensions();
        this.blitterBatch = this.addBatch(new BlitterBatch(this.game, gl, this));
        this.aaQuadBatch = this.addBatch(new AAQuadBatch(this.game, gl, this));
        this.spriteBatch = this.addBatch(new SpriteBatch(this.game, gl, this));
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
        for (var i = 0, l = this.batches.length; i < l; ++i)
        {
            this.batches[i].bind();
            this.batches[i].resize(width, height, resolution);
        }
        if (this.batch) 
        {
            this.batch.bind();
        }
    },

    //  Call at the start of the render loop
    preRender: function ()
    {
        //  No point rendering if our context has been blown up!
        if (this.contextLost)
        {
            return;
        }

        //  Add Pre-render hook

        var gl = this.gl;
        var color = this.game.config.backgroundColor;

        gl.clearColor(color.redGL, color.greenGL, color.blueGL, color.alphaGL);
        // Some drivers require to call glClear
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

        this.setBlendMode(BlendModes.NORMAL);
    },

    /**
     * Renders a single State.
     *
     * @method render
     * @param {Phaser.State} state - The State to be rendered.
     * @param {number} interpolationPercentage - The cumulative amount of time that hasn't been simulated yet, divided
     *   by the amount of time that will be simulated the next time update()
     *   runs. Useful for interpolating frames.
     */
    render: function (state, children, interpolationPercentage, camera)
    {
        //  Could move to the State Systems or MainLoop
        var gl = this.gl;
        var scissor = (camera.x !== 0 || camera.y !== 0 || camera.width !== gl.canvas.width || camera.height !== gl.canvas.height);

        if (scissor)
        {
            gl.enable(gl.SCISSOR_TEST);
            gl.scissor(camera.x, (gl.drawingBufferHeight - camera.y - camera.height), camera.width, camera.height);
        }
        // We could either clear color or render a quad
        gl.clear(gl.COLOR_BUFFER_BIT);

        var list = children.list;
        var length = list.length;
        for (var index = 0; index < length; ++index)
        {
            var child = list[index];
            // Setting blend mode if needed            
            var batch = this.batch;
            var newBlendMode = child.blendMode;
            if (this.blendMode !== newBlendMode)
            {
                if (batch) 
                {
                    batch.flush();
                }
                var blend = this.blendModes[newBlendMode];
                gl.enable(gl.BLEND);
                if (blend.length > 2)
                {
                    gl.blendFuncSeparate(blend[0], blend[1], blend[2], blend[3]);
                }
                else
                {
                    gl.blendFunc(blend[0], blend[1]);        
                }
                this.blendMode = newBlendMode;
            }
            // drawing child
            child.renderWebGL(this, child, interpolationPercentage, camera);
            batch = this.batch;
            if (batch && batch.isFull())
            {
                batch.flush();
            }
        }
        if (this.batch)
        {
            this.batch.flush();
        }
        if (camera._fadeAlpha > 0 || camera._flashAlpha > 0)
        {
            var aaQuadBatch = this.aaQuadBatch;
            aaQuadBatch.bind();
            // fade rendering
            aaQuadBatch.add(
                camera.x, camera.y, camera.width, camera.height, 
                camera._fadeRed, 
                camera._fadeGreen, 
                camera._fadeBlue, 
                camera._fadeAlpha
            );
            // flash rendering
            aaQuadBatch.add(
                camera.x, camera.y, camera.width, camera.height, 
                camera._flashRed, 
                camera._flashGreen, 
                camera._flashBlue, 
                camera._flashAlpha
            );
            aaQuadBatch.flush();
            this.batch.bind();
        }
        if (scissor)
        {
            gl.disable(gl.SCISSOR_TEST);
        }
    },

    //  Called at the end of the render loop (tidy things up, etc)
    postRender: function ()
    {
        if (this.batch)
        {
            this.batch.flush();
        }
        //  Add Post-render hook

        // console.log('%c render end ', 'color: #ffffff; background: #ff0000;');
    },

    destroy: function ()
    {
        this.gl = null;
    },

    createFBO: function () {},

    setBlendMode: function (newBlendMode)
    {
        var gl = this.gl;
        var batch = this.batch;
        var blend = null;

        if (this.blendMode !== newBlendMode)
        {
            if (batch)
                batch.flush();
            blend = this.blendModes[newBlendMode];
            gl.enable(gl.BLEND);
            if (blend.length > 2)
            {
                gl.blendFuncSeparate(blend[0], blend[1], blend[2], blend[3]);
            }
            else
            {
                gl.blendFunc(blend[0], blend[1]);        
            }
            this.blendMode = newBlendMode;
        }
    },

    addBatch: function (batchInstance)
    {
        var index = this.batches.indexOf(batchInstance);
        if (index < 0) 
        {
            this.batches.push(batchInstance);
            return batchInstance;
        }
        return null;
    }
};

module.exports = WebGLRenderer;
