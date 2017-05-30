
var StaticTilemap = require('./StaticTilemap');
var FactoryContainer = require('../../gameobjects/FactoryContainer');

var StaticTilemapFactory = {

    KEY: 'staticTilemap',

    add: function (mapData, x, y, width, height, key, frame)
    {
        return this.children.add(new StaticTilemap(this.state, mapData, x, y, width, height, key, frame));
    },

    make: function (mapData, x, y, width, height, key, frame)
    {
        return new StaticTilemap(this.state, mapData, x, y, width, height, key, frame);
    }

};

module.exports = FactoryContainer.register(StaticTilemapFactory);
