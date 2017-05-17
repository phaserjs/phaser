var DataBuffer32 = require('../../utils/DataBuffer32');
var DataBuffer16 = require('../../utils/DataBuffer16');
var UntexturedAndTintedShader = require('../../shaders/UntexturedAndTintedShader');

var PHASER_CONST = require('../../../../const');
var CONST = require('./const');

var QuadBatch = function (game, gl, manager)
{
    this.game = game;
    this.type = PHASER_CONST.WEBGL;
    this.view = game.canvas;
    this.resolution = game.config.resolution;
    this.width = game.config.width * game.config.resolution;
    this.height = game.config.height * game.config.resolution;
    this.glContext = gl;
    this.maxQuads = null;
    this.shader = null;
    this.vertexBufferObject = null;
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

QuadBatch.prototype.constructor = QuadBatch;

QuadBatch.prototype = {

    init: function (gl)
    {

        var vertexDataBuffer = new DataBuffer32(CONST.VERTEX_SIZE * CONST.AAQUAD_VERTEX_COUNT * CONST.MAX_AAQUAD);
        var indexDataBuffer = new DataBuffer16(CONST.INDEX_SIZE * CONST.AAQUAD_INDEX_COUNT * CONST.MAX_AAQUAD);
        var shader = this.manager.resourceManager.createShader('UntexturedAndTintedShader', UntexturedAndTintedShader);
        var indexBufferObject = this.manager.resourceManager.createBuffer(gl.ELEMENT_ARRAY_BUFFER, indexDataBuffer.getByteCapacity(), gl.STATIC_DRAW);
        var vertexBufferObject = this.manager.resourceManager.createBuffer(gl.ARRAY_BUFFER, vertexDataBuffer.getByteCapacity(), gl.STREAM_DRAW);
        var viewMatrixLocation = shader.getUniformLocation('u_view_matrix');
        var indexBuffer = indexDataBuffer.uintView;
        var max = CONST.MAX_AAQUAD * CONST.AAQUAD_INDEX_COUNT;

        vertexBufferObject.addAttribute(shader.getAttribLocation('a_position'), 2, gl.FLOAT, false, CONST.VERTEX_SIZE, 0);
        vertexBufferObject.addAttribute(shader.getAttribLocation('a_color'), 4, gl.FLOAT, false, CONST.VERTEX_SIZE, 8);

        this.vertexDataBuffer = vertexDataBuffer;
        this.indexDataBuffer = indexDataBuffer;
        this.shader = shader;
        this.indexBufferObject = indexBufferObject;
        this.vertexBufferObject = vertexBufferObject;
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

        indexBufferObject.updateResource(indexBuffer, 0);

        this.resize(this.width, this.height, this.game.config.resolution);
    },

    shouldFlush: function ()
    {
        return false;
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

    bind: function (shader)
    {
        if (shader === undefined)
        {
            this.shader.bind();
        }
        else
        {
            shader.bind();
            this.resize(this.width, this.height, this.game.config.resolution, shader);
        }
        this.indexBufferObject.bind();
        this.vertexBufferObject.bind();
    },

    flush: function (shader)
    {
        var gl = this.glContext;
        var vertexDataBuffer = this.vertexDataBuffer;

        if (this.elementCount === 0)
        {
            return;
        }
        
        this.bind(shader);
        this.vertexBufferObject.updateResource(vertexDataBuffer.getUsedBufferAsFloat(), 0);
        gl.drawElements(gl.TRIANGLES, this.elementCount, gl.UNSIGNED_SHORT, 0);
        vertexDataBuffer.clear();
        this.elementCount = 0;
    },

    resize: function (width, height, resolution, shader)
    {
        var gl = this.glContext;
        var activeShader = shader !== undefined ? shader : this.shader;
        
        this.width = width * resolution;
        this.height = height * resolution;

        activeShader.setConstantMatrix4x4(
            this.viewMatrixLocation,
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
        this.manager.resourceManager.deleteShader(this.shader);
        this.manager.resourceManager.deleteBuffer(this.indexBufferObject);
        this.manager.resourceManager.deleteBuffer(this.vertexBufferObject);

        this.shader = null;
        this.indexBufferObject = null;
        this.vertexBufferObject = null;
    }
};

module.exports = QuadBatch;
