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

    getTileAt: function (tileX, tileY, nonNull)
    {
        return TilemapComponents.GetTileAt(tileX, tileY, this.layer, nonNull);
    },

    hasTileAt: function (tileX, tileY)
    {
        return TilemapComponents.HasTileAt(tileX, tileY, this.layer);
    }

    // forEach: function (callback)
    // {
    //     this.tileArray.forEach(callback);
    // },

    //  Returns Object containing:
    //  {
    //      alpha
    //      frameWidth,
    //      frameHeight,
    //      frameX
    //      frameY
    //      id
    //      index = the tile in the tileset to render
    //      textureWidth = tileset texture size
    //      textureHeight
    //      tint
    //      visible
    //      width
    //      x
    //      y
    //  }

    // getTileAt: function (x, y)
    // {
    //     var ix = (x|0);
    //     var iy = (y|0);
    //     var tiles = this.tileArray;
    //     var index = iy * this.mapWidth + ix;

    //     if (index < tiles.length)
    //     {
    //         return tiles[index];
    //     }

    //     return null;
    // },

    // getTileAtIndex: function (index)
    // {
    //     var tiles = this.tileArray;

    //     if (index < tiles.length)
    //     {
    //         return tiles[index];
    //     }

    //     return null;
    // }

});

module.exports = DynamicTilemapLayer;
