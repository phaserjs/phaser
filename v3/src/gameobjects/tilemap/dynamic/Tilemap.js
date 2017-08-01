var Class = require('../../../utils/Class');
var GameObject = require('../../GameObject');
var Components = require('../../components');
var TilemapRender = require('./TilemapRender');
var Tile = require('./Tile');

var Tilemap = new Class({

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
        TilemapRender
    ],

    initialize:

    function Tilemap (scene, mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, tileBorder, texture, frame)
    {
        GameObject.call(this, scene, 'Tilemap');

        this.mapData = (mapData !== null) ? new Uint32Array(mapData) : new Uint32Array(mapWidth * mapHeight);
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.tileArray = [];
        this.culledTiles = [];
        this.tileBorder = tileBorder;
        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setOrigin();
        this.setSize(tileWidth * mapWidth, tileHeight * mapHeight);
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
        var mapData = this.mapData;
        var border = this.tileBorder;
        var tileWidth = this.tileWidth;
        var tileHeight = this.tileHeight;
        var tileWidthBorder = tileWidth + border * 2;
        var tileHeightBorder = tileHeight + border * 2;
        var width = this.texture.source[0].width;
        var height = this.texture.source[0].height;
        var mapWidth = this.mapWidth;
        var mapHeight = this.mapHeight;
        var setWidth = width / tileWidth;

        tileArray.length = 0;

        for (var y = 0; y < mapHeight; ++y)
        {
            for (var x = 0; x < mapWidth; ++x)
            {
                var tileId = mapData[y * mapWidth + x];
                var halfTileWidth = (tileWidthBorder) * 0.5;
                var halfTileHeight = (tileHeightBorder) * 0.5;
                var rectx = (((tileId % setWidth)|0) * tileWidthBorder) + halfTileWidth;
                var recty = (((tileId / setWidth)|0) * tileHeightBorder) + halfTileHeight;
                var tx = x * tileWidth;
                var ty = y * tileHeight;

                tileArray.push(new Tile({
                    index: x + y,
                    id: tileId,
                    x: tx,
                    y: ty,
                    width: tileWidth,
                    height: tileHeight,
                    frameX: rectx,
                    frameY: recty,
                    frameWidth: tileWidth,
                    frameHeight: tileHeight,
                    textureWidth: width,
                    textureHeight: height,
                    border: border
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
    //      index = the tile in the tilset to render
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

module.exports = Tilemap;
