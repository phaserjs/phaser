
var Class = require('../../../utils/Class');
var GameObject = require('../../GameObject');
var Components = require('../../../components');
var StaticTilemapRender = require('./StaticTilemapRender');
var CONST = require('../../../renderer/webgl/renderers/tilemaprenderer/const');

var StaticTilemap = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Flip,
        Components.GetBounds,
        Components.Origin,
        Components.RenderTarget,
        Components.ScaleMode,
        Components.Size,
        Components.Texture,
        Components.Transform,
        Components.Visible,
        StaticTilemapRender
    ],

    initialize:

    function StaticTilemap (state, mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, texture, frame)
    {
        GameObject.call(this, state, 'StaticTilemap');

        this.vbo = null;
        this.gl = state.game.renderer.gl ? state.game.renderer.gl : null;
        this.tilemapRenderer = state.game.renderer.tilemapRenderer ? state.game.renderer.tilemapRenderer : null;
        this.resourceManager = this.gl ? state.game.renderer.resourceManager : null;
        this.bufferData = null;
        this.mapData = mapData;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.dirty = true;
        this.vertexCount = 0;
        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setOrigin();
        this.setSize(tileWidth * mapWidth, tileHeight * mapHeight);
    },

    upload: function () 
    {
        if (this.dirty && this.gl)
        {
            var gl = this.gl;
            var vbo = this.vbo;
            var mapWidth = this.mapWidth;
            var mapHeight = this.mapHeight;
            var tileWidth = this.tileWidth;
            var tileHeight = this.tileHeight;
            var bufferData = this.bufferData;
            var bufferF32, bufferU32;
            var voffset = 0;
            var vertexCount = 0;

            if (this.vbo === null)
            {
                vbo = this.resourceManager.createBuffer(gl.ARRAY_BUFFER, (4 * 6 * (mapWidth * mapHeight)) * 4, gl.STATIC_DRAW);
                vbo.addAttribute(this.tilemapRenderer.shader.getAttribLocation('a_position'), 2, gl.FLOAT, false, CONST.VERTEX_SIZE, 0);
                vbo.addAttribute(this.tilemapRenderer.shader.getAttribLocation('a_tex_coord'), 2, gl.FLOAT, false, CONST.VERTEX_SIZE, 8);
                bufferData = this.bufferData = new ArrayBuffer((4 * 6 * (mapWidth * mapHeight)) * 4);
                this.vbo = vbo;
            }

            bufferF32 = new Float32Array(bufferData);

            for (var y = 0; y < mapHeight; ++y)
            {
                for (var x = 0; x < mapWidth; ++x)
                {
                    var tx = x * tileWidth;
                    var ty = y * tileHeight;
                    var txw = tx + tileWidth;
                    var tyh = ty + tileHeight;
                    var tx0 = tx;
                    var ty0 = ty;
                    var tx1 = tx;
                    var ty1 = tyh;
                    var tx2 = txw;
                    var ty2 = tyh;
                    var tx3 = txw;
                    var ty3 = ty;

                    bufferF32[voffset + 0] = tx0;
                    bufferF32[voffset + 1] = ty0;
                    bufferF32[voffset + 2] = 0;
                    bufferF32[voffset + 3] = 0;

                    bufferF32[voffset + 0] = tx1;
                    bufferF32[voffset + 1] = ty1;
                    bufferF32[voffset + 2] = 0;
                    bufferF32[voffset + 3] = 1

                    bufferF32[voffset + 0] = tx2;
                    bufferF32[voffset + 1] = ty2;
                    bufferF32[voffset + 2] = 1;
                    bufferF32[voffset + 3] = 1;

                    bufferF32[voffset + 0] = tx0;
                    bufferF32[voffset + 1] = ty0;
                    bufferF32[voffset + 2] = 0;
                    bufferF32[voffset + 3] = 0;

                    bufferF32[voffset + 0] = tx2;
                    bufferF32[voffset + 1] = ty2;
                    bufferF32[voffset + 2] = 1;
                    bufferF32[voffset + 3] = 1;

                    bufferF32[voffset + 0] = tx3;
                    bufferF32[voffset + 1] = ty3;
                    bufferF32[voffset + 2] = 1;
                    bufferF32[voffset + 3] = 0;
                    
                    vertexCount += 6;
                }
            }
            this.vertexCount = vertexCount;
            vbo.updateResource(bufferData, 0);

            this.dirty = false;
        }
    }

});

module.exports = StaticTilemap;
