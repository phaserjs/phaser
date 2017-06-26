
var Tilemap = require('./Tilemap');
var BuildFromConfig = require('./BuildFromConfig');
var FactoryContainer = require('../../../gameobjects/FactoryContainer');

var TilemapFactory = {

    KEY: 'tilemap',

    add: function (mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, texture, frame)
    {
        return this.children.add(new Tilemap(this.state, mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, texture, frame));
    },

    make: function (config)
    {
        return BuildFromConfig(this.state, config);
    }

};

module.exports = FactoryContainer.register(TilemapFactory);
