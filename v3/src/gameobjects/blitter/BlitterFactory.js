
var Blitter = require('./Blitter');
var FactoryContainer = require('../../gameobjects/FactoryContainer');

var BlitterFactory = {

    KEY: 'blitter',

    add: function (x, y, key, frame, parent)
    {
        if (parent === undefined) { parent = this.state; }

        return parent.children.add(new Blitter(this.state, x, y, key, frame));
    },

    make: function (x, y, key, frame)
    {
        return new Blitter(this.state, x, y, key, frame);
    }

};

module.exports = FactoryContainer.register(BlitterFactory);
