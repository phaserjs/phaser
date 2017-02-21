var BindVertexArray = require('../../utils/vao/BindVertexArray');
var CreateProgram = require('../../utils/shader/CreateProgram');
var CreateShader = require('../../utils/shader/CreateShader');
var CreateBuffer = require('../../utils/buffer/CreateBuffer');
var CreateAttribDesc = require('../../utils/vao/CreateAttribDesc');
var Buffer32 = require('../../utils/buffer/Buffer32');
var Buffer16 = require('../../utils/buffer/Buffer16');
var VertexArray = require('../../utils/vao/VertexArray');

var PHASER_CONST = require('../../../../const');
var CONST = require('./const');

var SpriteBatch = function (game, gl, manager)
{
    this.game = game;
    this.type = PHASER_CONST.WEBGL;
    this.view = game.canvas;
    this.resolution = game.config.resolution;
    this.width = game.config.width * game.config.resolution;
    this.height = game.config.height * game.config.resolution;
    this.glContext = gl;
    this.maxSprites = null;
    this.vertShader = null;
    this.fragShader = null;
    this.program = null;
    this.vertexArray = null;
    this.indexBufferObject = null;
    this.vertexDataBuffer = null;
    this.indexDataBuffer = null;
    this.elementCount = 0;
    this.currentTexture2D = null;
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

SpriteBatch.prototype.constructor = SpriteBatch;

SpriteBatch.prototype = {

    init: function (gl)
    {

        var vertexDataBuffer = new Buffer32(CONST.VERTEX_SIZE * CONST.SPRITE_VERTEX_COUNT * CONST.MAX_SPRITES);
        var indexDataBuffer = new Buffer16(CONST.INDEX_SIZE * CONST.SPRITE_INDEX_COUNT * CONST.MAX_SPRITES);
        var vertShader = CreateShader(gl, CONST.VERTEX_SHADER_SOURCE, gl.VERTEX_SHADER);
        var fragShader = CreateShader(gl, CONST.FRAGMENT_SHADER_SOURCE, gl.FRAGMENT_SHADER);
        var program = CreateProgram(gl, vertShader, fragShader);
        var indexBufferObject = CreateBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW, null, indexDataBuffer.getByteCapacity());
        var attribArray = [
            CreateAttribDesc(gl, program, 'a_position', 2, gl.FLOAT, false, CONST.VERTEX_SIZE, 0),
            CreateAttribDesc(gl, program, 'a_tex_coord', 2, gl.FLOAT, false, CONST.VERTEX_SIZE, 8),
            CreateAttribDesc(gl, program, 'a_translate', 2, gl.FLOAT, false, CONST.VERTEX_SIZE, 16),
            CreateAttribDesc(gl, program, 'a_scale', 2, gl.FLOAT, false, CONST.VERTEX_SIZE, 24),
            CreateAttribDesc(gl, program, 'a_rotation', 1, gl.FLOAT, false, CONST.VERTEX_SIZE, 32),
            CreateAttribDesc(gl, program, 'a_color', 3, gl.UNSIGNED_BYTE, true, CONST.VERTEX_SIZE, 36)
        ];
        var vertexArray = new VertexArray(CreateBuffer(gl, gl.ARRAY_BUFFER, gl.STREAM_DRAW, null, vertexDataBuffer.getByteCapacity()), attribArray);
        var viewMatrixLocation = gl.getUniformLocation(program, 'u_view_matrix');
        var indexBuffer = indexDataBuffer.uintView;
        var max = CONST.MAX_SPRITES * CONST.SPRITE_INDEX_COUNT;

        this.vertexDataBuffer = vertexDataBuffer;
        this.indexDataBuffer = indexDataBuffer;
        this.vertShader = vertShader;
        this.fragShader = fragShader;
        this.program = program;
        this.indexBufferObject = indexBufferObject;
        this.vertexArray = vertexArray;
        this.viewMatrixLocation = viewMatrixLocation;

        // Populate the index buffer only once
        for (var indexA = 0, indexB = 0; indexA < max; indexA += CONST.SPRITE_INDEX_COUNT, indexB += CONST.SPRITE_VERTEX_COUNT)
        {
            indexBuffer[indexA + 0] = indexB + 0;
            indexBuffer[indexA + 1] = indexB + 1;
            indexBuffer[indexA + 2] = indexB + 2;
            indexBuffer[indexA + 3] = indexB + 0;
            indexBuffer[indexA + 4] = indexB + 2;
            indexBuffer[indexA + 5] = indexB + 3;
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
        gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, indexBuffer);

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
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBufferObject);
        BindVertexArray(gl, this.vertexArray);
    },

    unbind: function ()
    {
        var gl = this.glContext;

        gl.useProgram(null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    },

    flush: function ()
    {
        if (this.elementCount === 0)
        {
            return;
        }

        var gl = this.glContext;
        var vertexDataBuffer = this.vertexDataBuffer;

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertexDataBuffer.getUsedBufferAsFloat());
        gl.drawElements(gl.TRIANGLES, this.elementCount, gl.UNSIGNED_SHORT, 0);
        vertexDataBuffer.clear();

        this.elementCount = 0;
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
            gl.deleteBuffer(this.indexBufferObject);
            gl.deleteBuffer(this.vertexArray.buffer);
        }
    }

};

module.exports = SpriteBatch;
