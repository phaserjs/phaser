var Graphics = require('./Graphics');
var FactoryContainer = require('../FactoryContainer');

var GraphicsFactory = {

    KEY: 'graphics',

    add: function (options)
    {
        return this.children.add(new Graphics(this.state, options));
    },

    make: function (options)
    {
        return new Graphics(this.state, options);
    }

};

module.exports = FactoryContainer.register(GraphicsFactory);
