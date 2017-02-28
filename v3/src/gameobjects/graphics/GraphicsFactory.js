var Graphics = require('./Graphics');
var FactoryContainer = require('../../gameobjects/FactoryContainer');

var GraphicsFactory = {

    KEY: 'graphics',

    add: function (x, y, group)
    {
        if (group === undefined) { group = this.state; }

        return group.children.add(new Graphics(this.state, x, y));
    },

    make: function (x, y)
    {
        return new Graphics(this.state, x, y);
    }

};

module.exports = FactoryContainer.register(GraphicsFactory);
