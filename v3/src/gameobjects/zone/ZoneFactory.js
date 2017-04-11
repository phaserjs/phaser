var Zone = require('./Zone');
var FactoryContainer = require('../FactoryContainer');

var ZoneFactory = {

    KEY: 'zone',

    add: function (x, y, width, height)
    {
        return new Zone(this.state, x, y, width, height);
    },

    make: function (x, y, width, height)
    {
        return new Zone(this.state, x, y, width, height);
    }

};

module.exports = FactoryContainer.register(ZoneFactory);
