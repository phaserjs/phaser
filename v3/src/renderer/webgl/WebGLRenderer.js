/**
* @author       Richard Davey (@photonstorm)
* @author       Felipe Alfonso (@bitnenfer)
* @copyright    2017 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var CONST = require('../../const');
var BlitterBatch = require('./renderers/blitterbatch/BlitterBatch');
var QuadBatch = require('./renderers/quadbatch/QuadBatch');
var SpriteBatch = require('./renderers/spritebatch/SpriteBatch');
var TileBatch = require('./renderers/tilebatch/TileBatch');
var ShapeBatch = require('./renderers/shapebatch/ShapeBatch');
var EffectRenderer = require('./renderers/effectrenderer/EffectRenderer');
var BlendModes = require('../BlendModes');
var ScaleModes = require('../ScaleModes');
var ResourceManager = require('./ResourceManager');
var Resources = require('./resources');
var Snapshot = require('../../snapshot/Snapshot');

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
    this.rendererArray = [];
    this.blitterBatch = null;
    this.aaQuadBatch = null;
    this.spriteBatch = null;
    this.shapeBatch = null;
    this.effectRenderer = null;
    this.currentRenderer = null;
    this.currentTexture = null;
    this.shaderCache = {};
    this.currentShader = null;
    this.resourceManager = null;
    this.currentRenderTarget = null;
    this.snapshotCallback = null;

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

        this.resourceManager = new ResourceManager(gl);
    
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        gl.enable(gl.BLEND);
        gl.clearColor(color.redGL, color.greenGL, color.blueGL, color.alphaGL);


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
        this.blitterBatch = this.addRenderer(new BlitterBatch(this.game, gl, this));
        this.quadBatch = this.addRenderer(new QuadBatch(this.game, gl, this));
        this.spriteBatch = this.addRenderer(new SpriteBatch(this.game, gl, this));
        this.shapeBatch = this.addRenderer(new ShapeBatch(this.game, gl, this));
        this.effectRenderer = this.addRenderer(new EffectRenderer(this.game, gl, this));
        this.tileBatch = this.addRenderer(new TileBatch(this.game, gl, this));
        this.currentRenderer = this.spriteBatch;
        this.setBlendMode(0);
        this.resize(this.width, this.height);
    },

    createTexture: function (source, width, height)
    {
        width = source ? source.width : width;
        height = source ? source.height : height;
        var pot = ((width & (width - 1)) == 0 && (height & (height - 1)) == 0);
        var gl = this.gl;
        var filter = gl.NEAREST;
        var wrap = pot ? gl.REPEAT : gl.CLAMP_TO_EDGE;

        if (!source.glTexture)
        {

            if (source.scaleMode === ScaleModes.LINEAR)
            {
                filter = gl.LINEAR;
            }
            else if (source.scaleMode === ScaleModes.NEAREST)
            {
                filter = gl.NEAREST;
            }

            if (!source && typeof width === 'number' && typeof height === 'number')
            {
                source.glTexture = this.resourceManager.createTexture(
                    0,
                    filter,
                    filter,
                    wrap,
                    wrap,
                    gl.RGBA,
                    null,
                    width, height
                );
            }
            else
            {
                source.glTexture = this.resourceManager.createTexture(
                    0,
                    filter,
                    filter,
                    wrap,
                    wrap,
                    gl.RGBA,
                    source.image
                );
            }
        }

        this.currentTexture = null;
    },

    setTexture: function (texture)
    {
        if (this.currentTexture !== texture)
        {
            var gl = this.gl;

            this.currentRenderer.flush();
            
            gl.activeTexture(gl.TEXTURE0);

            if (texture !== null)
            {
                gl.bindTexture(gl.TEXTURE_2D, texture.texture);
            }
            else
            {
                gl.bindTexture(gl.TEXTURE_2D, null);
            }

            this.currentTexture = texture;
        }
    },

    setRenderer: function (renderer, texture, renderTarget)
    {
        this.setTexture(texture);
        this.setRenderTarget(renderTarget);
        
        if (this.currentRenderer !== renderer || this.currentRenderer.shouldFlush())
        {
            this.currentRenderer.flush();
            this.currentRenderer = renderer;
        }
    },

    setRenderTarget: function (renderTarget)
    {
        var gl = this.gl;

        if (this.currentRenderTarget !== renderTarget)
        {
            this.currentRenderer.flush();

            if (renderTarget !== null)
            {
                gl.bindFramebuffer(gl.FRAMEBUFFER, renderTarget.framebufferObject);
                if (renderTarget.shouldClear)
                {
                    gl.clearColor(0, 0, 0, 0);
                    gl.clear(gl.COLOR_BUFFER_BIT);
                    renderTarget.shouldClear = false;
                }
            }
            else
            {
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                gl.viewport(0, 0, this.width, this.height);
            }
            this.currentRenderTarget = renderTarget;
        }
    },

    resize: function (width, height)
    {
        var resolution = this.game.config.resolution;

        this.width = width * resolution;
        this.height = height * resolution;

        this.view.width = this.width;
        this.view.height = this.height;

        if (this.autoResize)
        {
            this.view.style.width = (this.width / resolution) + 'px';
            this.view.style.height = (this.height / resolution) + 'px';
        }

        this.gl.viewport(0, 0, this.width, this.height);
        for (var i = 0, l = this.rendererArray.length; i < l; ++i)
        {
            this.rendererArray[i].bind();
            this.rendererArray[i].resize(width, height, resolution);
        }
        this.currentRenderer.bind();
    },

    //  Call at the start of the render loop
    preRender: function ()
    {
        this.setRenderTarget(null);
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

        this.setRenderTarget(null);
        if (scissor)
        {
            gl.enable(gl.SCISSOR_TEST);
            gl.scissor(camera.x, (gl.drawingBufferHeight - camera.y - camera.height), camera.width, camera.height);
        }
        // We could either clear color or render a quad
        var color = this.game.config.backgroundColor;
        gl.clearColor(color.redGL, color.greenGL, color.blueGL, color.alphaGL);
        gl.clear(gl.COLOR_BUFFER_BIT);

        var list = children.list;
        var length = list.length;
        for (var index = 0; index < length; ++index)
        {
            var child = list[index];
            // Setting blend mode if needed            
            var renderer = this.currentRenderer;
            var newBlendMode = child.blendMode;
            if (this.blendMode !== newBlendMode)
            {
                if (renderer) 
                {
                    renderer.flush();
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
            renderer = this.currentRenderer;
            if (renderer.isFull() || renderer.shouldFlush())
            {
                renderer.flush();
            }
        }
        
        this.currentRenderer.flush();
        
        if (camera._fadeAlpha > 0 || camera._flashAlpha > 0)
        {
            this.setRenderTarget(null);
            var quadBatch = this.quadBatch;
            quadBatch.bind();
            // fade rendering
            quadBatch.add(
                camera.x, camera.y, camera.width, camera.height, 
                camera._fadeRed, 
                camera._fadeGreen, 
                camera._fadeBlue, 
                camera._fadeAlpha
            );
            // flash rendering
            quadBatch.add(
                camera.x, camera.y, camera.width, camera.height, 
                camera._flashRed, 
                camera._flashGreen, 
                camera._flashBlue, 
                camera._flashAlpha
            );
            quadBatch.flush();
            this.currentRenderer.bind();
        }
        if (scissor)
        {
            gl.disable(gl.SCISSOR_TEST);
        }
    },

    //  Called at the end of the render loop (tidy things up, etc)
    postRender: function ()
    {
        this.currentRenderer.flush();

        if (this.snapshotCallback)
        {

            this.snapshotCallback(Snapshot.WebGLSnapshot(this.view));
            this.snapshotCallback = null;
        }

        //  Add Post-render hook

        // console.log('%c render end ', 'color: #ffffff; background: #ff0000;');
    },

    snapshot: function (callback) 
    {
        this.snapshotCallback = callback;
    },


    destroy: function ()
    {
        this.gl = null;
    },

    createFBO: function () {},

    setBlendMode: function (newBlendMode)
    {
        var gl = this.gl;
        var renderer = this.currentRenderer;
        var blend = null;

        if (this.blendMode !== newBlendMode)
        {
            if (renderer)
                renderer.flush();
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

    addRenderer: function (rendererInstance)
    {
        var index = this.rendererArray.indexOf(rendererInstance);
        if (index < 0) 
        {
            this.rendererArray.push(rendererInstance);
            return rendererInstance;
        }
        return null;
    },

    setTextureFilterMode: function (texture, filterMode)
    {
        var gl = this.gl;
        var glFilter = [gl.LINEAR, gl.NEAREST][filterMode];

        gl.bindTexture(gl.TEXTURE_2D, texture.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, glFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, glFilter);
        if (this.currentTexture !== null)
            gl.bindTexture(gl.TEXTURE_2D, this.currentTexture.texture);
        else
            gl.bindTexture(gl.TEXTURE_2D, null);

        return texture;
    },

    uploadCanvasToGPU: function (srcCanvas, dstTexture, shouldUpdateResource)
    {
        var gl = this.gl;

        if (!dstTexture)
        {
            dstTexture = new Resources.Texture(null, 0, 0);
            /* only call this once */
            dstTexture.texture = gl.createTexture();
        }
        if (shouldUpdateResource)
        {
            /* Update resource */
            gl.bindTexture(gl.TEXTURE_2D, dstTexture.texture);
            gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, srcCanvas);
        }
        else
        {
            /* Allocate or Reallocate resource */
            gl.bindTexture(gl.TEXTURE_2D, dstTexture.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, srcCanvas);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }

        dstTexture.width = srcCanvas.width;
        dstTexture.height = srcCanvas.height;

        /* we must rebind old texture */
        this.currentTexture = null;

        return dstTexture;
    }
};

module.exports = WebGLRenderer;
