var Graphics = require('./Graphics');
var FactoryContainer = require('../../gameobjects/FactoryContainer');

var GraphicsFactory = {

    KEY: 'graphics',

    add: function (options)
    {
        return this.state.children.add(new Graphics(this.state, options));
    },

    make: function (options)
    {
        return new Graphics(this.state, options);
    }

};

module.exports = FactoryContainer.register(GraphicsFactory);
