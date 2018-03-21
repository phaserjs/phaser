var Layer = require('./Layer');
var FactoryContainer = require('../../gameobjects/FactoryContainer');

var LayerFactory = {

    KEY: 'layer',

    add: function (children)
    {
        return new Layer(this.state, children);
    },

    make: function (children)
    {
        return new Layer(this.state, children);
    }

};

module.exports = FactoryContainer.register(LayerFactory);
