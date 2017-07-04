
var Tilemap = require('./Tilemap');

var TilemapFactory = function (state, mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, tileBorder, texture, frame)
{
    return new Tilemap(state, mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, tileBorder, texture, frame);
};

module.exports = TilemapFactory;
