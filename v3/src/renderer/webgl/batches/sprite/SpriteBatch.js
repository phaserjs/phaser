var BindVertexArray = require('../../utils/vao/BindVertexArray');
var CreateProgram = require('../../utils/shader/CreateProgram');
var CreateShader = require('../../utils/shader/CreateShader');
var CreateBuffer = require('../../utils/buffer/CreateBuffer');
var CreateAttribDesc = require('../../utils/vao/CreateAttribDesc');
var VertexBuffer = require('../../utils/buffer/VertexBuffer');
var IndexBuffer = require('../../utils/buffer/IndexBuffer');
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

        var vertexDataBuffer = new VertexBuffer(CONST.VERTEX_SIZE * CONST.SPRITE_VERTEX_COUNT * CONST.MAX_SPRITES);

        var indexDataBuffer = new IndexBuffer(CONST.INDEX_SIZE * CONST.SPRITE_INDEX_COUNT * CONST.MAX_SPRITES);

        var vertShader = CreateShader(gl, CONST.VERTEX_SHADER_SOURCE, gl.VERTEX_SHADER);
        var fragShader = CreateShader(gl, CONST.FRAGMENT_SHADER_SOURCE, gl.FRAGMENT_SHADER);
        var program = CreateProgram(gl, vertShader, fragShader);

        var indexBufferObject = CreateBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW, null, indexDataBuffer.getByteCapacity());

        var attribArray = [
            CreateAttribDesc(gl, program, 'a_position', 2, gl.FLOAT, false, CONST.VERTEX_SIZE, 0),
            CreateAttribDesc(gl, program, 'a_tex_coord', 2, gl.FLOAT, false, CONST.VERTEX_SIZE, 8),
            CreateAttribDesc(gl, program, 'a_translate', 2, gl.FLOAT, false, CONST.VERTEX_SIZE, 16),
            CreateAttribDesc(gl, program, 'a_scale', 2, gl.FLOAT, false, CONST.VERTEX_SIZE, 24),
            CreateAttribDesc(gl, program, 'a_rotation', 1, gl.FLOAT, false, CONST.VERTEX_SIZE, 32)
        ];

        var vertexArray = new VertexArray(CreateBuffer(gl, gl.ARRAY_BUFFER, gl.STREAM_DRAW, null, vertexDataBuffer.getByteCapacity()), attribArray);

        var viewMatrixLocation = gl.getUniformLocation(program, 'u_view_matrix');

        this.vertexDataBuffer = vertexDataBuffer;
        this.indexDataBuffer = indexDataBuffer;

        this.vertShader = vertShader;
        this.fragShader = fragShader;
        this.program = program;

        this.indexBufferObject = indexBufferObject;
        this.vertexArray = vertexArray;


        this.viewMatrixLocation = viewMatrixLocation;
           
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);

        var indexBuffer = indexDataBuffer.wordView;
        var max = CONST.MAX_SPRITES * CONST.SPRITE_INDEX_COUNT;

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
        gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, indexDataBuffer.getUsedBufferAsWord());

        this.bind();

        this.resize(this.width, this.height);

        this.unbind();
    },

    isFull: function ()
    {
        return (this.vertexDataBuffer.getByteLength() >= this.vertexDataBuffer.getByteCapacity());
    },

    add: function (frame, pivotX, pivotY, translateX, translateY, scaleX, scaleY, rotation)
    {
        this.manager.setBatch(this, frame.texture.source[0].glTexture);

        // The user must check if the buffers are full before flushing
        // this is to give freedom of when should the renderer flush. var vertexDataBuffer = this.vertexDataBuffer;
        var vertexDataBuffer = this.vertexDataBuffer;
        var vertexBuffer = vertexDataBuffer.floatView;
        var vertexOffset = vertexDataBuffer.allocate(CONST.SPRITE_VERTEX_COMPONENT_COUNT * CONST.SPRITE_VERTEX_COUNT);
        var uvs = frame.uvs;
        var x = -pivotX;
        var y = -pivotY;
        var width = frame.width;
        var height = frame.height;

        vertexBuffer[vertexOffset++] = x;
        vertexBuffer[vertexOffset++] = y;
        vertexBuffer[vertexOffset++] = uvs.x0;
        vertexBuffer[vertexOffset++] = uvs.y0;
        vertexBuffer[vertexOffset++] = translateX;
        vertexBuffer[vertexOffset++] = translateY;
        vertexBuffer[vertexOffset++] = scaleX;
        vertexBuffer[vertexOffset++] = scaleY;
        vertexBuffer[vertexOffset++] = rotation;

        vertexBuffer[vertexOffset++] = x;
        vertexBuffer[vertexOffset++] = y + height;
        vertexBuffer[vertexOffset++] = uvs.x1;
        vertexBuffer[vertexOffset++] = uvs.y1;
        vertexBuffer[vertexOffset++] = translateX;
        vertexBuffer[vertexOffset++] = translateY;
        vertexBuffer[vertexOffset++] = scaleX;
        vertexBuffer[vertexOffset++] = scaleY;
        vertexBuffer[vertexOffset++] = rotation;
    
        vertexBuffer[vertexOffset++] = x + width;
        vertexBuffer[vertexOffset++] = y + height;
        vertexBuffer[vertexOffset++] = uvs.x2;
        vertexBuffer[vertexOffset++] = uvs.y2;
        vertexBuffer[vertexOffset++] = translateX;
        vertexBuffer[vertexOffset++] = translateY;
        vertexBuffer[vertexOffset++] = scaleX;
        vertexBuffer[vertexOffset++] = scaleY;
        vertexBuffer[vertexOffset++] = rotation;

        vertexBuffer[vertexOffset++] = x + width;
        vertexBuffer[vertexOffset++] = y;
        vertexBuffer[vertexOffset++] = uvs.x3;
        vertexBuffer[vertexOffset++] = uvs.y3;
        vertexBuffer[vertexOffset++] = translateX;
        vertexBuffer[vertexOffset++] = translateY;
        vertexBuffer[vertexOffset++] = scaleX;
        vertexBuffer[vertexOffset++] = scaleY;
        vertexBuffer[vertexOffset++] = rotation;

        this.elementCount += CONST.SPRITE_INDEX_COUNT;
    },

    bind: function ()
    {
        var gl = this.glContext;

        gl.useProgram(this.program);

        gl.clearColor(0, 0, 0, 1);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBufferObject);

        BindVertexArray(gl, this.vertexArray);
    },

    unbind: function ()
    {
        var gl = this.glContext;

        gl.useProgram(null);

        gl.disable(gl.BLEND);

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

    resize: function (width, height)
    {
        var gl = this.glContext;
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

        gl.viewport(0, 0, this.width, this.height);

        gl.uniformMatrix4fv(
            this.viewMatrixLocation,
            false,
            new Float32Array([
                2 / this.view.width, 0, 0, 0,
                0, -2 / this.view.height, 0, 0,
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
