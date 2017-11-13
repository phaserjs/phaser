var Class = require('../../../utils/Class');
var GameObject = require('../../GameObject');
var Components = require('../../components');
var DynamicTilemapLayerRender = require('./DynamicTilemapLayerRender');
var Tile = require('./Tile');

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

        this.tileArray = [];
        this.culledTiles = [];

        this.setTexture(tileset.image.key);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setOrigin();
        this.setSize(this.map.tileWidth * this.layer.width, this.map.tileheight * this.layer.height);

        this.skipIndexZero = false;

        this.buildTilemap();
    },

    getTotalTileCount: function ()
    {
        return this.tileArray.length;
    },

    getVisibleTileCount: function (camera)
    {
        return this.cull(camera).length;
    },

    buildTilemap: function ()
    {
        var tileArray = this.tileArray;
        var mapData = this.layer.data;
        var tileWidth = this.map.tileWidth;
        var tileHeight = this.map.tileHeight;
        var tileset = this.tileset;
        var width = this.texture.source[0].width;
        var height = this.texture.source[0].height;
        var mapWidth = this.layer.width;
        var mapHeight = this.layer.height;

        tileArray.length = 0;

        for (var row = 0; row < mapHeight; ++row)
        {
            for (var col = 0; col < mapWidth; ++col)
            {
                var tileIndex = mapData[row][col].index;
                if (tileIndex <= 0 && this.skipIndexZero) { continue; }

                var texCoords = tileset.getTileTextureCoordinates(tileIndex);
                if (texCoords === null) { continue; }

                tileArray.push(new Tile({
                    index: tileIndex,
                    id: tileIndex,
                    x: col * tileWidth,
                    y: row * tileHeight,
                    width: tileWidth,
                    height: tileHeight,
                    frameX: texCoords.x,
                    frameY: texCoords.y,
                    frameWidth: tileWidth,
                    frameHeight: tileHeight,
                    textureWidth: width,
                    textureHeight: height
                }));
            }
        }
    },

    cull: function (camera)
    {
        var culledTiles = this.culledTiles;
        var tiles = this.tileArray;
        var length = tiles.length;
        var scrollX = camera.scrollX * this.scrollFactorX;
        var scrollY = camera.scrollY * this.scrollFactorY;
        var cameraW = camera.width;
        var cameraH = camera.height;

        culledTiles.length = 0;

        for (var index = 0; index < length; ++index)
        {
            var tile = tiles[index];
            var tileX = tile.x - scrollX;
            var tileY = tile.y - scrollY;
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

        return culledTiles;
    },

    forEach: function (callback)
    {
        this.tileArray.forEach(callback);
    },

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

    getTileAt: function (x, y)
    {
        var ix = (x|0);
        var iy = (y|0);
        var tiles = this.tileArray;
        var index = iy * this.mapWidth + ix;

        if (index < tiles.length)
        {
            return tiles[index];
        }

        return null;
    },

    getTileAtIndex: function (index)
    {
        var tiles = this.tileArray;

        if (index < tiles.length)
        {
            return tiles[index];
        }

        return null;
    }

});

module.exports = DynamicTilemapLayer;
