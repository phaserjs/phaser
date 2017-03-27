var Layer = require('./Layer');
var FactoryContainer = require('../../gameobjects/FactoryContainer');

var LayerFactory = {

    KEY: 'layer',

    add: function (children)
    {
        return new Layer(children);
    },

    make: function (children)
    {
        return new Layer(children);
    }

};

module.exports = FactoryContainer.register(LayerFactory);
