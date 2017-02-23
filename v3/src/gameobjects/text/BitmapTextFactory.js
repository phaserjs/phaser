var BitmapText = require('./BitmapText');
var FactoryContainer = require('../../gameobjects/FactoryContainer');

var BitmapTextFactory = {

    KEY: 'bitmapText',

    add: function (x, y, key, text, group)
    {
        if (group === undefined) { group = this.state; }

        return group.children.add(new BitmapText(this.state, x, y, key, text));
    },

    make: function (x, y, key, text)
    {
        return new BitmapText(this.state, x, y, key, text);
    }

};

module.exports = FactoryContainer.register(BitmapTextFactory);
