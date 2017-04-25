
var TileSprite = require('./TileSprite');
var FactoryContainer = require('../../gameobjects/FactoryContainer');

var TileSpriteFactory = {

    KEY: 'tileSprite',

    add: function (x, y, key, frame)
    {
        return this.children.add(new TileSprite(this.state, x, y, key, frame));
    },

    make: function (x, y, key, frame)
    {
        return new TileSprite(this.state, x, y, key, frame);
    }

};

module.exports = FactoryContainer.register(TileSpriteFactory);
