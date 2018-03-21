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

var AAQuadBatch = function (game, gl, manager)
{
    this.game = game;
    this.type = PHASER_CONST.WEBGL;
    this.view = game.canvas;
    this.resolution = game.config.resolution;
    this.width = game.config.width * game.config.resolution;
    this.height = game.config.height * game.config.resolution;
    this.glContext = gl;
    this.maxQuads = null;
    this.vertShader = null;
    this.fragShader = null;
    this.program = null;
    this.vertexArray = null;
    this.indexBufferObject = null;
    this.vertexDataBuffer = null;
    this.indexDataBuffer = null;
    this.elementCount = 0;
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

AAQuadBatch.prototype.constructor = AAQuadBatch;

AAQuadBatch.prototype = {

    init: function (gl)
    {

        var vertexDataBuffer = new Buffer32(CONST.VERTEX_SIZE * CONST.AAQUAD_VERTEX_COUNT * CONST.MAX_AAQUAD);
        var indexDataBuffer = new Buffer16(CONST.INDEX_SIZE * CONST.AAQUAD_INDEX_COUNT * CONST.MAX_AAQUAD);
        var vertShader = CreateShader(gl, CONST.VERTEX_SHADER_SOURCE, gl.VERTEX_SHADER);
        var fragShader = CreateShader(gl, CONST.FRAGMENT_SHADER_SOURCE, gl.FRAGMENT_SHADER);
        var program = CreateProgram(gl, vertShader, fragShader);
        var indexBufferObject = CreateBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW, null, indexDataBuffer.getByteCapacity());
        var attribArray = [
            CreateAttribDesc(gl, program, 'a_position', 2, gl.FLOAT, false, CONST.VERTEX_SIZE, 0),
            CreateAttribDesc(gl, program, 'a_color', 4, gl.FLOAT, false, CONST.VERTEX_SIZE, 8)
        ];
        var vertexArray = new VertexArray(CreateBuffer(gl, gl.ARRAY_BUFFER, gl.STREAM_DRAW, null, vertexDataBuffer.getByteCapacity()), attribArray);
        var viewMatrixLocation = gl.getUniformLocation(program, 'u_view_matrix');
        var indexBuffer = indexDataBuffer.uintView;
        var max = CONST.MAX_AAQUAD * CONST.AAQUAD_INDEX_COUNT;

        this.vertexDataBuffer = vertexDataBuffer;
        this.indexDataBuffer = indexDataBuffer;
        this.vertShader = vertShader;
        this.fragShader = fragShader;
        this.program = program;
        this.indexBufferObject = indexBufferObject;
        this.vertexArray = vertexArray;
        this.viewMatrixLocation = viewMatrixLocation;

        // Populate the index buffer only once
        for (var indexA = 0, indexB = 0; indexA < max; indexA += CONST.AAQUAD_INDEX_COUNT, indexB += CONST.AAQUAD_VERTEX_COUNT)
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

    add: function (x, y, width, height, red, green, blue, alpha)
    {
        // The user must check if the buffers are full before flushing
        // this is to give freedom of when should the renderer flush. var vertexDataBuffer = this.vertexDataBuffer;
        var vertexDataBuffer = this.vertexDataBuffer;
        var floatBuffer = vertexDataBuffer.floatView;
        var vertexOffset = vertexDataBuffer.allocate(CONST.AAQUAD_VERTEX_COMPONENT_COUNT * CONST.AAQUAD_VERTEX_COUNT);

        floatBuffer[vertexOffset++] = x;
        floatBuffer[vertexOffset++] = y;
        floatBuffer[vertexOffset++] = red;
        floatBuffer[vertexOffset++] = green;
        floatBuffer[vertexOffset++] = blue;
        floatBuffer[vertexOffset++] = alpha;

        floatBuffer[vertexOffset++] = x;
        floatBuffer[vertexOffset++] = y + height;
        floatBuffer[vertexOffset++] = red;
        floatBuffer[vertexOffset++] = green;
        floatBuffer[vertexOffset++] = blue;
        floatBuffer[vertexOffset++] = alpha;

        floatBuffer[vertexOffset++] = x + width;
        floatBuffer[vertexOffset++] = y + height;
        floatBuffer[vertexOffset++] = red;
        floatBuffer[vertexOffset++] = green;
        floatBuffer[vertexOffset++] = blue;
        floatBuffer[vertexOffset++] = alpha;

        floatBuffer[vertexOffset++] = x + width;
        floatBuffer[vertexOffset++] = y;
        floatBuffer[vertexOffset++] = red;
        floatBuffer[vertexOffset++] = green;
        floatBuffer[vertexOffset++] = blue;
        floatBuffer[vertexOffset++] = alpha;

        this.elementCount += CONST.AAQUAD_INDEX_COUNT;
    },

    bind: function ()
    {
        var gl = this.glContext;

        gl.useProgram(this.program);
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

module.exports = AAQuadBatch;
