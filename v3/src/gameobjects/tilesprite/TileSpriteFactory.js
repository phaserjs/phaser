
var TileSprite = require('./TileSprite');
var FactoryContainer = require('../../gameobjects/FactoryContainer');

var TileSpriteFactory = {

    KEY: 'tileSprite',

    add: function (x, y, width, height, key, frame)
    {
        return this.children.add(new TileSprite(this.state, x, y, width, height, key, frame));
    },

    make: function (x, y, width, height, key, frame)
    {
        return new TileSprite(this.state, x, y, width, height, key, frame);
    }

};

module.exports = FactoryContainer.register(TileSpriteFactory);
