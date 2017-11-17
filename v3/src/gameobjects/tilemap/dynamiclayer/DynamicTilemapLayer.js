var Class = require('../../../utils/Class');
var GameObject = require('../../GameObject');
var Components = require('../../components');
var DynamicTilemapLayerRender = require('./DynamicTilemapLayerRender');
var TilemapComponents = require('../components');

var DynamicTilemapLayer = new Class({

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
        DynamicTilemapLayerRender
    ],

    initialize:

    function DynamicTilemapLayer (scene, tilemap, layerIndex, tileset, x, y)
    {
        GameObject.call(this, scene, 'DynamicTilemapLayer');

        this.map = tilemap;
        this.layerIndex = layerIndex;
        this.layer = tilemap.layers[layerIndex];
        this.tileset = tileset;

        this.culledTiles = [];

        this.setTexture(tileset.image.key);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setOrigin();
        this.setSize(this.map.tileWidth * this.layer.width, this.map.tileheight * this.layer.height);

        this.skipIndexZero = false;
    },

    getTotalTileCount: function ()
    {
        return this.tileArray.length;
    },

    getVisibleTileCount: function (camera)
    {
        return this.cull(camera).length;
    },

    cull: function (camera)
    {
        var mapData = this.layer.data;
        var mapWidth = this.layer.width;
        var mapHeight = this.layer.height;
        var culledTiles = this.culledTiles;
        var scrollX = camera.scrollX * this.scrollFactorX;
        var scrollY = camera.scrollY * this.scrollFactorY;
        var cameraW = camera.width;
        var cameraH = camera.height;

        culledTiles.length = 0;

        for (var row = 0; row < mapHeight; ++row)
        {
            for (var col = 0; col < mapWidth; ++col)
            {
                var tile = mapData[row][col];

                if (tile === null || (tile.index <= 0 && this.skipIndexZero)) { continue; }

                var tileX = tile.worldX - scrollX;
                var tileY = tile.worldY - scrollY;
                var tileW = tile.width;
                var tileH = tile.height;
                var cullW = cameraW + tileW;
                var cullH = cameraH + tileH;

                if (tile.visible &&
                    tileX > -tileW && tileY > -tileH &&
                    tileX < cullW && tileY < cullH)
                {
                    culledTiles.push(tile);
                }
            }
        }

        return culledTiles;
    },

    copy: function (srcTileX, srcTileY, width, height, destTileX, destTileY)
    {
        TilemapComponents.Copy(srcTileX, srcTileY, width, height, destTileX, destTileY, this.layer);
        return this;
    },

    fill: function (index, tileX, tileY, width, height)
    {
        TilemapComponents.Fill(index, tileX, tileY, width, height, this.layer);
        return this;
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

    getTileAtWorldXY: function (worldX, worldY, nonNull)
    {
        return TilemapComponents.GetTileAtWorldXY(worldX, worldY, nonNull, this.layer);
    },

    getTilesWithin: function (tileX, tileY, width, height)
    {
        return TilemapComponents.GetTilesWithin(tileX, tileY, width, height, this.layer);
    },

    hasTileAt: function (tileX, tileY)
    {
        return TilemapComponents.HasTileAt(tileX, tileY, this.layer);
    },

    putTile: function (tile, tileX, tileY)
    {
        return TilemapComponents.PutTile(tile, tileX, tileY, this.layer);
    },

    randomize: function (tileX, tileY, width, height, indices)
    {
        TilemapComponents.Randomize(tileX, tileY, width, height, indices, this.layer);
        return this;
    },

    removeTile: function (tileX, tileY, replaceWithNull)
    {
        return TilemapComponents.RemoveTile(tileX, tileY, replaceWithNull, this.layer);
    },

    replaceByIndex: function (findIndex, newIndex, tileX, tileY, width, height)
    {
        TilemapComponents.ReplaceByIndex(findIndex, newIndex, tileX, tileY, width, height, this.layer);
        return this;
    },

    shuffle: function (tileX, tileY, width, height)
    {
        TilemapComponents.Shuffle(tileX, tileY, width, height, this.layer);
        return this;
    },

    swapByIndex: function (indexA, indexB, tileX, tileY, width, height)
    {
        TilemapComponents.SwapByIndex(indexA, indexB, tileX, tileY, width, height, this.layer);
        return this;
    }

});

module.exports = DynamicTilemapLayer;
