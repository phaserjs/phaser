
var StaticTilemap = require('./StaticTilemap');
var FactoryContainer = require('../../../gameobjects/FactoryContainer');

var StaticTilemapFactory = {

    KEY: 'staticTilemap',

    add: function (mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, texture, frame)
    {
        return this.children.add(new StaticTilemap(this.state, mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, texture, frame));
    },

    make: function (mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, texture, frame)
    {
        return new StaticTilemap(this.state, mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, texture, frame);
    }

};

module.exports = FactoryContainer.register(StaticTilemapFactory);
