
var StaticTilemap = require('./StaticTilemap');
var BuildFromConfig = require('./BuildFromConfig');
var FactoryContainer = require('../../../gameobjects/FactoryContainer');

var StaticTilemapFactory = {

    KEY: 'staticTilemap',

    add: function (mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, tileBorder, texture, frame)
    {
        return this.children.add(new StaticTilemap(this.state, mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, tileBorder, texture, frame));
    },

    make: function (config)
    {
        return BuildFromConfig(this.state, config);
    }

};

module.exports = FactoryContainer.register(StaticTilemapFactory);
