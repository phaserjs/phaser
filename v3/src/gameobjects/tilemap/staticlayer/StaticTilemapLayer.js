var Class = require('../../../utils/Class');
var Components = require('../../components');
var CONST = require('../../../renderer/webgl/renderers/tilemaprenderer/const');
var GameObject = require('../../GameObject');
var StaticTilemapLayerRender = require('./StaticTilemapLayerRender');

var StaticTilemapLayer = new Class({

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
        Components.ScrollFactor,
        StaticTilemapLayerRender
    ],

    initialize:

    function StaticTilemapLayer (scene, mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, tileBorder, texture, frame)
    {
        GameObject.call(this, scene, 'StaticTilemapLayer');

        this.vbo = null;
        this.gl = scene.sys.game.renderer.gl ? scene.sys.game.renderer.gl : null;
        this.tilemapRenderer = scene.sys.game.renderer.tilemapRenderer ? scene.sys.game.renderer.tilemapRenderer : null;
        this.resourceManager = this.gl ? scene.sys.game.renderer.resourceManager : null;
        this.bufferData = null;

        this.mapData = mapData;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;

        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;

        this.dirty = true;
        this.vertexCount = 0;
        this.cullStart = 0;
        this.cullEnd = 0;

        this.tileBorder = tileBorder;

        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setOrigin();
        this.setSize(tileWidth * mapWidth, tileHeight * mapHeight);

        this.skipIndexZero = false;

        scene.sys.game.renderer.addContextRestoredCallback(this.contextRestore.bind(this));
    },

    contextRestore: function (renderer)
    {
        this.tileTexture = null;
        this.dirty = true;
        this.vbo = null;
        this.gl = renderer.gl;
        this.tilemapRenderer = renderer.tilemapRenderer;
    },

    upload: function (camera)
    {
        var mapWidth = this.mapWidth;
        var mapHeight = this.mapHeight;
        var border = this.tileBorder;
        var tileWidth = this.tileWidth;
        var tileHeight = this.tileHeight;
        var tileWidthBorder = tileWidth + border * 2;
        var tileHeightBorder = tileHeight + border * 2;
        var width = this.texture.source[0].width;
        var height = this.texture.source[0].height;
        var setWidth = width / tileWidth;
        var mapData = this.mapData;

        var x;
        var y;

        if (this.gl)
        {
            if (this.dirty)
            {
                var gl = this.gl;
                var vbo = this.vbo;
                var bufferData = this.bufferData;
                var bufferF32;
                var voffset = 0;
                var vertexCount = 0;

                if (this.vbo === null)
                {
                    vbo = this.resourceManager.createBuffer(gl.ARRAY_BUFFER, (4 * 6 * (mapWidth * mapHeight)) * 4, gl.STATIC_DRAW);

                    vbo.addAttribute(this.tilemapRenderer.shader.getAttribLocation('a_position'), 2, gl.FLOAT, false, CONST.VERTEX_SIZE, 0);
                    vbo.addAttribute(this.tilemapRenderer.shader.getAttribLocation('a_tex_coord'), 2, gl.FLOAT, false, CONST.VERTEX_SIZE, 8);

                    bufferData = this.bufferData = new ArrayBuffer((4 * 6 * (mapWidth * mapHeight)) * 4);

                    this.vbo = vbo;

                    vbo.bind();
                }

                bufferF32 = new Float32Array(bufferData);

                for (y = 0; y < mapHeight; ++y)
                {
                    for (x = 0; x < mapWidth; ++x)
                    {
                        var tileId = mapData[y * mapWidth + x];

                        if (tileId <= 0 && this.skipIndexZero)
                        {
                            continue;
                        }

                        var halfTileWidth = (tileWidthBorder) * 0.5;
                        var halfTileHeight = (tileHeightBorder) * 0.5;

                        var rectx = (((tileId % setWidth)|0) * tileWidthBorder) + halfTileWidth;
                        var recty = (((tileId / setWidth)|0) * tileHeightBorder) + halfTileHeight;

                        var tx = x * tileWidth;
                        var ty = y * tileHeight;
                        var txw = tx + tileWidth;
                        var tyh = ty + tileHeight;

                        var u0 = (rectx - (halfTileWidth - 0.5)) / width;
                        var v0 = (recty - (halfTileHeight - 0.5)) / height;
                        var u1 = (rectx + (halfTileWidth - 0.5)) / width;
                        var v1 = (recty + (halfTileHeight - 0.5)) / height;

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
                        bufferF32[voffset + 2] = u0;
                        bufferF32[voffset + 3] = v0;

                        bufferF32[voffset + 4] = tx1;
                        bufferF32[voffset + 5] = ty1;
                        bufferF32[voffset + 6] = u0;
                        bufferF32[voffset + 7] = v1;

                        bufferF32[voffset + 8] = tx2;
                        bufferF32[voffset + 9] = ty2;
                        bufferF32[voffset + 10] = u1;
                        bufferF32[voffset + 11] = v1;

                        bufferF32[voffset + 12] = tx0;
                        bufferF32[voffset + 13] = ty0;
                        bufferF32[voffset + 14] = u0;
                        bufferF32[voffset + 15] = v0;

                        bufferF32[voffset + 16] = tx2;
                        bufferF32[voffset + 17] = ty2;
                        bufferF32[voffset + 18] = u1;
                        bufferF32[voffset + 19] = v1;

                        bufferF32[voffset + 20] = tx3;
                        bufferF32[voffset + 21] = ty3;
                        bufferF32[voffset + 22] = u1;
                        bufferF32[voffset + 23] = v0;

                        voffset += 24;
                        vertexCount += 6;
                    }
                }

                this.vertexCount = vertexCount;

                vbo.updateResource(bufferData, 0);

                this.dirty = false;
            }

            var renderer = this.tilemapRenderer;

            renderer.shader.setConstantFloat2(renderer.scrollLocation, camera.scrollX, camera.scrollY);
            renderer.shader.setConstantFloat2(renderer.scrollFactorLocation, this.scrollFactorX, this.scrollFactorY);
            renderer.shader.setConstantFloat2(renderer.tilemapPositionLocation, this.x, this.y);

            var cmat = camera.matrix.matrix;

            renderer.shader.setConstantMatrix3x3(
                renderer.cameraTransformLocation,
                [
                    cmat[0], cmat[1], 0.0,
                    cmat[2], cmat[3], 0.0,
                    cmat[4], cmat[5], 1.0
                ]
            );
        }
        else if (this.dirty && !this.gl)
        {
            this.tiles = [];

            for (y = 0; y < mapHeight; ++y)
            {
                for (x = 0; x < mapWidth; ++x)
                {
                    var id = mapData[y * mapWidth + x];

                    if (id <= 0 && this.skipIndexZero)
                    {
                        continue;
                    }

                    var frameX = (((id % setWidth) | 0) * tileWidthBorder);
                    var frameY = (((id / setWidth) | 0) * tileHeightBorder);

                    this.tiles.push({
                        x: x * tileWidth,
                        y: y * tileHeight,
                        frameX: frameX,
                        frameY: frameY
                    });

                }
            }

            this.dirty = false;
        }
    },

    getTotalTileCount: function ()
    {
        return this.mapData.length;
    },

    getVisibleTileCount: function (camera)
    {
        this.cull(camera);

        return (this.cullEnd - this.cullStart) / 6;
    },

    cull: function (camera)
    {
        this.cullStart = 0;
        this.cullEnd = 0;

        var tileWidth = this.tileWidth;
        var tileHeight = this.tileHeight;

        var pixelX = this.x - (camera.scrollX * this.scrollFactorX);
        var pixelY = this.y - (camera.scrollY * this.scrollFactorY);
        var pixelWidth = this.mapWidth * tileWidth;
        var pixelHeight = this.mapHeight * tileHeight;

        if (pixelX < camera.x + camera.width + (tileWidth * 2) &&
            pixelX + pixelWidth > camera.x + -(tileWidth * 2) &&
            pixelY < camera.y + camera.height + (tileHeight * 2) &&
            pixelY + pixelHeight > camera.y + -(tileHeight * 2))
        {
            var interX = Math.max(pixelX, camera.x + -(tileWidth * 2));
            var interY = Math.max(pixelY, camera.y + -(tileHeight * 2));

            var interWidth = Math.min(pixelX + pixelWidth, camera.x + camera.width + (tileWidth * 2)) - interX;
            var interHeight = Math.min(pixelY + pixelHeight, camera.y + camera.height + (tileHeight * 2)) - interY;

            interX = ((interX + (camera.scrollX * this.scrollFactorX)) / tileWidth) | 0;
            interY = ((interY + (camera.scrollY * this.scrollFactorY)) / tileHeight) | 0;

            interWidth = (interWidth / tileWidth) | 0;
            interHeight = (interHeight / tileHeight) | 0;

            this.cullStart = (interY * this.mapWidth + interX) * 6;
            this.cullEnd = ((interY + interHeight) * this.mapWidth + interX) * 6;
        }
    }

});

module.exports = StaticTilemapLayer;
