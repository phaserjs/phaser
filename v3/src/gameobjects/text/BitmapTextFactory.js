var BitmapText = require('./BitmapText');
var FactoryContainer = require('../../gameobjects/FactoryContainer');

var BitmapTextFactory = {

    KEY: 'bitmapText',

    add: function (x, y, text, key, subKey, group)
    {
        if (group === undefined) { group = this.state; }

        return group.children.add(new BitmapText(this.state, x, y, text, key, subKey));
    },

    make: function (x, y, text, key, subKey)
    {
        return new BitmapText(this.state, x, y, text, key, subKey);
    }

};

module.exports = FactoryContainer.register(BitmapTextFactory);
