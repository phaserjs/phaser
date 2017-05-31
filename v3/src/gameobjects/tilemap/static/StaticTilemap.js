
var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../../components');
var StaticTilemapRender = require('./StaticTilemapRender');

var TileSprite = new Class({

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
        this.bufferData = null;
        this.mapData = mapData;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.dirty = true;
        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setOrigin();
        this.setSize(width, height);

    },

    upload: function () 
    {
        if (this.dirty)
        {
            var gl;
            var vbo = this.vbo;
            var mapWidth = this.mapWidth;
            var mapHeight = this.mapHeight;
            var tileWidth = this.tileWidth;
            var tileHeight = this.tileHeight;
            var bufferData = this.bufferData;
            var bufferF32, bufferU32;
            var voffset = 0;

            if (this.vbo === null)
            {
                vbo = this.vbo = gl.createBuffer();
                bufferData = this.bufferData = new ArrayBuffer((4 * 6 * (mapWidth * mapHeight)) * 4);
                gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
                gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
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
                }
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, bufferData);

            this.dirty = false;
        }
    }

});

module.exports = StaticTilemap;
