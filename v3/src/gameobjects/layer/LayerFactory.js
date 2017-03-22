var Layer = require('./Layer');
var FactoryContainer = require('../../gameobjects/FactoryContainer');

var LayerFactory = {

    KEY: 'layer',

    add: function ()
    {
        var layer = new Layer();
        layer.addArray(Array.prototype.slice.apply(arguments));
        return layer;
    },

    make: function ()
    {
        var layer = new Layer();
        layer.addArray(Array.prototype.slice.apply(arguments));
        return layer;
    }

};

module.exports = FactoryContainer.register(LayerFactory);
