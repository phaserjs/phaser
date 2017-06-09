
var Class = require('../../../utils/Class');
var GameObject = require('../../GameObject');
var Components = require('../../../components');
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
        TilemapRender
    ],

    initialize:

    function Tilemap (state, mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, texture, frame)
    {
        GameObject.call(this, state, 'Tilemap');

        this.mapData = mapData;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.tileArray = [];
        this.culledTiles = [];
        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setOrigin();
        this.setSize(tileWidth * mapWidth, tileHeight * mapHeight);
        this.buildTilemap();
    },

    buildTilemap: function () 
    {
        var tileArray = this.tileArray;
        var mapData = this.mapData;
        var frame = this.frame;
        var tileWidth = this.tileWidth;
        var tileHeight = this.tileHeight;
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
                var rectx = ((tileId % setWidth)|0) * tileWidth;
                var recty = ((tileId / setWidth)|0) * tileHeight;
                var tx = x * tileWidth;
                var ty = y * tileHeight;
                
                tileArray.push(new Tile({
                    id: tileId,
                    x: tx,
                    y: ty,
                    width: tileWidth,
                    height: tileHeight,
                    frame: frame
                }));
            }
        }
    },

    cull: function (rect)
    {
        /* implement tilemap culling */
    }

});

module.exports = Tilemap;
