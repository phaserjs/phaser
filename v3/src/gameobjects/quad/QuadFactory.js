
var Quad = require('./Quad');
var BuildFromConfig = require('./BuildFromConfig');
var FactoryContainer = require('../../gameobjects/FactoryContainer');

var QuadFactory = {

    KEY: 'quad',

    add: function (x, y, key, frame)
    {
        return this.children.add(new Quad(this.state, x, y, key, frame));
    },

    make: function (config)
    {
        return BuildFromConfig(this.state, config);
    }

};

module.exports = FactoryContainer.register(QuadFactory);
