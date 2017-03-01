var BindVertexArray = require('../../utils/vao/BindVertexArray');
var CreateProgram = require('../../utils/shader/CreateProgram');
var CreateShader = require('../../utils/shader/CreateShader');
var CreateBuffer = require('../../utils/buffer/CreateBuffer');
var CreateAttribDesc = require('../../utils/vao/CreateAttribDesc');
var Buffer32 = require('../../utils/buffer/Buffer32');
var VertexArray = require('../../utils/vao/VertexArray');

var PHASER_CONST = require('../../../../const');
var CONST = require('./const');

var ShapeBatch = function (game, gl, manager)
{
    this.game = game;
    this.type = PHASER_CONST.WEBGL;
    this.view = game.canvas;
    this.resolution = game.config.resolution;
    this.width = game.config.width * game.config.resolution;
    this.height = game.config.height * game.config.resolution;
    this.glContext = gl;
    this.maxVertices = null;
    this.vertShader = null;
    this.fragShader = null;
    this.program = null;
    this.vertexArray = null;
    this.vertexDataBuffer = null;
    this.vertexCount = 0;
    this.viewMatrixLocation = null;

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
    this.dirty = false;

    this.init(this.glContext);
};

ShapeBatch.prototype.constructor = ShapeBatch;

ShapeBatch.prototype = {

    init: function (gl)
    {

        var vertexDataBuffer = new Buffer32(CONST.VERTEX_SIZE * CONST.MAX_VERTICES);
        var vertShader = CreateShader(gl, CONST.VERTEX_SHADER_SOURCE, gl.VERTEX_SHADER);
        var fragShader = CreateShader(gl, CONST.FRAGMENT_SHADER_SOURCE, gl.FRAGMENT_SHADER);
        var program = CreateProgram(gl, vertShader, fragShader);
        var attribArray = [
            CreateAttribDesc(gl, program, 'a_position', 2, gl.FLOAT, false, CONST.VERTEX_SIZE, 0),
            CreateAttribDesc(gl, program, 'a_color', 4, gl.UNSIGNED_BYTE, true, CONST.VERTEX_SIZE, 8),
            CreateAttribDesc(gl, program, 'a_alpha', 1, gl.FLOAT, false, CONST.VERTEX_SIZE, 12),
            CreateAttribDesc(gl, program, 'a_translate', 2, gl.FLOAT, false, CONST.VERTEX_SIZE, 16),
            CreateAttribDesc(gl, program, 'a_scale', 2, gl.FLOAT, false, CONST.VERTEX_SIZE, 24),
            CreateAttribDesc(gl, program, 'a_rotation', 1, gl.FLOAT, false, CONST.VERTEX_SIZE, 32),
        ];
        var vertexArray = new VertexArray(CreateBuffer(gl, gl.ARRAY_BUFFER, gl.STREAM_DRAW, null, vertexDataBuffer.getByteCapacity()), attribArray);
        var viewMatrixLocation = gl.getUniformLocation(program, 'u_view_matrix');
        var max = CONST.MAX_VERTICES;

        this.vertexDataBuffer = vertexDataBuffer;
        this.vertShader = vertShader;
        this.fragShader = fragShader;
        this.program = program;
        this.vertexArray = vertexArray;
        this.viewMatrixLocation = viewMatrixLocation;
        this.maxVertices = max;

        this.bind();
        this.resize(this.width, this.height, this.game.config.resolution);
        this.unbind();
    },

    isFull: function ()
    {
        return (this.vertexDataBuffer.getByteLength() >= this.vertexDataBuffer.getByteCapacity());
    },

    bind: function ()
    {
        var gl = this.glContext;

        gl.useProgram(this.program);
        gl.clearColor(0, 0, 0, 1);
        BindVertexArray(gl, this.vertexArray);
    },

    unbind: function ()
    {
        var gl = this.glContext;

        gl.useProgram(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    },

    flush: function ()
    {
        var gl = this.glContext;
        var vertexDataBuffer = this.vertexDataBuffer;

        if (this.vertexCount > 0)
        {
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertexDataBuffer.getUsedBufferAsFloat());
            gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
            vertexDataBuffer.clear();
            this.vertexCount = 0;
        }
    },

    resize: function (width, height, resolution)
    {
        var gl = this.glContext;
        
        this.width = width * resolution;
        this.height = height * resolution;
        
        gl.uniformMatrix4fv(
            this.viewMatrixLocation,
            false,
            new Float32Array([
                2 / this.width, 0, 0, 0,
                0, -2 / this.height, 0, 0,
                0, 0, 1, 1,
                -1, 1, 0, 0
            ])
        );
    },

    destroy: function ()
    {
        var gl = this.glContext;

        if (gl)
        {
            gl.deleteShader(this.vertShader);
            gl.deleteShader(this.fragShader);
            gl.deleteProgram(this.program);
            gl.deleteBuffer(this.vertexArray.buffer);
        }
    }
};

module.exports = ShapeBatch;
