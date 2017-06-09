var DataBuffer32 = require('../../utils/DataBuffer32');
var DataBuffer16 = require('../../utils/DataBuffer16');
var TilemapShader = require('../../shaders/TilemapShader');

var PHASER_CONST = require('../../../../const');
var CONST = require('./const');

var TilemapRenderer = function (game, gl, manager)
{
    this.game = game;
    this.type = PHASER_CONST.WEBGL;
    this.view = game.canvas;
    this.resolution = game.config.resolution;
    this.width = game.config.width * game.config.resolution;
    this.height = game.config.height * game.config.resolution;
    this.glContext = gl;
    this.shader = null;
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

TilemapRenderer.prototype.constructor = TilemapRenderer;

TilemapRenderer.prototype = {

    init: function (gl)
    {
        var shader = this.manager.resourceManager.createShader('TilemapShader', TilemapShader);
        var viewMatrixLocation = shader.getUniformLocation('u_view_matrix');
        var scrollLocation = shader.getUniformLocation('u_scroll');
        var scrollFactorLocation = shader.getUniformLocation('u_scroll_factor');
        var tilemapPositionLocation = shader.getUniformLocation('u_tilemap_position');

        this.shader = shader;
        this.viewMatrixLocation = viewMatrixLocation;
        this.scrollLocation = scrollLocation;
        this.scrollFactorLocation = scrollFactorLocation;
        this.tilemapPositionLocation = tilemapPositionLocation;

        this.resize(this.width, this.height, this.game.config.resolution);
    },

    shouldFlush: function ()
    {
        return false;
    },

    isFull: function ()
    {
        return false;
    },

    add: function (x, y, width, height, red, green, blue, alpha)
    {
        
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
    },

    flush: function (shader)
    {
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

        this.shader = null;
    }
};

module.exports = TilemapRenderer;
