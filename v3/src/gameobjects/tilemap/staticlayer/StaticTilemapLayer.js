var Class = require('../../../utils/Class');
var GameObject = require('../../GameObject');
var Components = require('../../components');
var CONST = require('../../../renderer/webgl/renderers/tilemaprenderer/const');
var StaticTilemapLayerRender = require('./StaticTilemapLayerRender');
var TilemapComponents = require('../components');

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

    function StaticTilemapLayer (scene, tilemap, layerIndex, tileset, x, y)
    {
        GameObject.call(this, scene, 'StaticTilemapLayer');

        this.map = tilemap;
        this.layerIndex = layerIndex;
        this.layer = tilemap.layers[layerIndex];
        this.tileset = tileset;

        // Link the layer data with this dynamic tilemap layer
        this.layer.tilemapLayer = this;

        this.vbo = null;
        this.gl = scene.sys.game.renderer.gl ? scene.sys.game.renderer.gl : null;
        this.tilemapRenderer = scene.sys.game.renderer.tilemapRenderer ? scene.sys.game.renderer.tilemapRenderer : null;
        this.resourceManager = this.gl ? scene.sys.game.renderer.resourceManager : null;
        this.bufferData = null;

        this.dirty = true;
        this.vertexCount = 0;
        this.culledTiles = [];

        this.setTexture(tileset.image.key);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setOrigin();
        this.setSize(this.map.tileWidth * this.layer.width, this.map.tileheight * this.layer.height);

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
        var tileset = this.tileset;
        var mapWidth = this.layer.width;
        var mapHeight = this.layer.height;
        var tileWidth = this.map.tileWidth;
        var tileHeight = this.map.tileHeight;
        var width = this.texture.source[0].width;
        var height = this.texture.source[0].height;
        var mapData = this.layer.data;

        var tile;
        var row;
        var col;
        var texCoords;

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

                for (row = 0; row < mapHeight; ++row)
                {
                    for (col = 0; col < mapWidth; ++col)
                    {
                        tile = mapData[row][col];
                        if (tile === null || (tile.index <= 0 && this.skipIndexZero)) { continue; }

                        var tx = col * tileWidth;
                        var ty = row * tileHeight;
                        var txw = tx + tileWidth;
                        var tyh = ty + tileHeight;

                        texCoords = tileset.getTileTextureCoordinates(tile.index);
                        if (texCoords === null) { continue; }

                        // Inset UV coordinates by 0.5px to prevent tile bleeding
                        var u0 = (texCoords.x + 0.5) / width;
                        var v0 = (texCoords.y + 0.5) / height;
                        var u1 = (texCoords.x + tileWidth - 0.5) / width;
                        var v1 = (texCoords.y + tileHeight - 0.5) / height;

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
    },

    cull: function (camera)
    {
        TilemapComponents.CullTiles(this.layer, camera, this.culledTiles);
    },

    destroy: function ()
    {
        this.layer.tilemapLayer = undefined;
        this.map = undefined;
        this.layer = undefined;
        this.tileset = undefined;
        GameObject.prototype.destroy.call(this);
    },

    findByIndex: function (findIndex, skip, reverse)
    {
        return TilemapComponents.FindByIndex(findIndex, skip, reverse, this.layer);
    },

    forEachTile: function (callback, context, tileX, tileY, width, height)
    {
        TilemapComponents.ForEachTile(callback, context, tileX, tileY, width, height, this.layer);
        return this;
    },

    getTileAt: function (tileX, tileY, nonNull)
    {
        return TilemapComponents.GetTileAt(tileX, tileY, nonNull, this.layer);
    },

    getTileAtWorldXY: function (worldX, worldY, nonNull, camera)
    {
        return TilemapComponents.GetTileAtWorldXY(worldX, worldY, nonNull, camera, this.layer);
    },

    getTilesWithin: function (tileX, tileY, width, height)
    {
        return TilemapComponents.GetTilesWithin(tileX, tileY, width, height, this.layer);
    },

    hasTileAt: function (tileX, tileY)
    {
        return TilemapComponents.HasTileAt(tileX, tileY, this.layer);
    },

    hasTileAtWorldXY: function (worldX, worldY, camera)
    {
        return TilemapComponents.HasTileAtWorldXY(worldX, worldY, camera, this.layer);
    },

    worldToTileX: function (worldX, camera)
    {
        return TilemapComponents.WorldToTileX(worldX, camera, this.layer);
    },

    worldToTileY: function (worldY, camera)
    {
        return TilemapComponents.WorldToTileY(worldY, camera, this.layer);
    },

    worldToTileXY: function (worldX, worldY, point, camera)
    {
        return TilemapComponents.WorldToTileXY(worldX, worldY, point, camera, this.layer);
    }

});

module.exports = StaticTilemapLayer;
