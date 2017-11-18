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

        // Link the layer data with this dynamic tilemap layer
        this.layer.tilemapLayer = this;

        this.culledTiles = [];

        this.setTexture(tileset.image.key);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setOrigin();
        this.setSize(this.map.tileWidth * this.layer.width, this.map.tileheight * this.layer.height);

        this.skipIndexZero = false;
    },

    cull: function (camera)
    {
        TilemapComponents.CullTiles(this.layer, camera, this.culledTiles);
    },

    copy: function (srcTileX, srcTileY, width, height, destTileX, destTileY)
    {
        TilemapComponents.Copy(srcTileX, srcTileY, width, height, destTileX, destTileY, this.layer);
        return this;
    },

    destroy: function ()
    {
        this.layer.tilemapLayer = undefined;
        this.map = undefined;
        this.layer = undefined;
        this.tileset = undefined;
        this.culledTiles.length = 0;
        GameObject.prototype.destroy.call(this);
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

    putTileAt: function (tile, tileX, tileY)
    {
        return TilemapComponents.PutTileAt(tile, tileX, tileY, this.layer);
    },

    putTileAtWorldXY: function (tile, worldX, worldY, camera)
    {
        return TilemapComponents.PutTileAtWorldXY(tile, worldX, worldY, camera, this.layer);
    },

    randomize: function (tileX, tileY, width, height, indices)
    {
        TilemapComponents.Randomize(tileX, tileY, width, height, indices, this.layer);
        return this;
    },

    removeTileAt: function (tileX, tileY, replaceWithNull)
    {
        return TilemapComponents.RemoveTileAt(tileX, tileY, replaceWithNull, this.layer);
    },

    removeTileAtWorldXY: function (worldX, worldY, replaceWithNull, camera)
    {
        return TilemapComponents.RemoveTileAtWorldXY(worldX, worldY, replaceWithNull, camera, this.layer);
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

module.exports = DynamicTilemapLayer;
