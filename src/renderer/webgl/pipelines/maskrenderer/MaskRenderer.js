var Class = require('../../../../utils/Class');
var DataBuffer16 = require('../../utils/DataBuffer16');
var DataBuffer32 = require('../../utils/DataBuffer32');
var PHASER_CONST = require('../../../../const');
var MaskShader = require('../../shaders/MaskShader');

var MaskRenderer = new Class({

    initialize:

    function MaskRenderer (game, gl, manager)
    {
        this.game = game;
        this.type = PHASER_CONST.WEBGL;
        this.view = game.canvas;
        this.resolution = game.config.resolution;
        this.width = game.config.width * game.config.resolution;
        this.height = game.config.height * game.config.resolution;
        this.glContext = gl;
        this.shader = null;
        this.vertexBufferObject = null;

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

        this.manager = manager;
        this.init(this.glContext);
    },

    init: function (gl)
    {
        var shader = this.manager.resourceManager.createShader('MaskShader', MaskShader);
        var vertexBufferObject = this.manager.resourceManager.createBuffer(
            gl.ARRAY_BUFFER, new Float32Array([
                -1.0, +1.0,
                -1.0, -1.0,
                +1.0, +1.0,
                +1.0, +1.0,
                -1.0, -1.0,
                +1.0, -1.0
            ]), 
            gl.STATIC_DRAW);

        this.shader = shader;
        this.vertexBufferObject = vertexBufferObject;

        vertexBufferObject.addAttribute(shader.getAttribLocation('a_position'), 2, gl.FLOAT, false, 8, 0);

        this.resize(this.width, this.height, this.game.config.resolution);
    },

    shouldFlush: function ()
    {
        return true;
    },

    isFull: function ()
    {
        return true;
    },

    bind: function (shader)
    {
        if (!shader)
        {
            this.shader.bind();
        }
        else
        {
            shader.bind();
            this.resize(this.width, this.height, this.game.config.resolution, shader);
        }

        this.vertexBufferObject.bind();
    },

    flush: function (shader, renderTarget, mainTexture, maskTexture)
    {
        // This is just a stub to make it work with WebGLRenderer flow
    },

    draw: function (shader, renderTarget, mainTexture, maskTexture)
    {
        var gl = this.glContext;
        var manager = this.manager;
        var program = this.shader.program;

        manager.setRenderer(this, mainTexture, renderTarget);

        manager.currentRenderer = this;

        this.shader.bind();
        this.vertexBufferObject.bind();

        gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), manager.width, manager.height);
        gl.uniform1i(gl.getUniformLocation(program, 'u_main_sampler'), 0);
        gl.uniform1i(gl.getUniformLocation(program, 'u_mask_sampler'), 1);

        manager.setTexture(mainTexture, 0);
        manager.setTexture(maskTexture, 1);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, mainTexture.texture);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, maskTexture.texture);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        
        if (renderTarget)
        {
            // Cleanup GL State
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
    },

    resize: function (width, height, resolution, shader)
    {
        var activeShader = (shader) ? shader : this.shader;
        var location = (activeShader === this.shader) ? this.viewMatrixLocation : activeShader.getUniformLocation('u_view_matrix');

        this.width = width * resolution;
        this.height = height * resolution;
        this.setProjectionMatrix(activeShader, location);
    },

    setProjectionMatrix: function (shader, location)
    {
    },

    destroy: function ()
    {
        this.manager.resourceManager.deleteShader(this.shader);
        this.manager.resourceManager.deleteBuffer(this.vertexBufferObject);

        this.shader = null;
        this.vertexBufferObject = null;
    },



});

module.exports = MaskRenderer;
