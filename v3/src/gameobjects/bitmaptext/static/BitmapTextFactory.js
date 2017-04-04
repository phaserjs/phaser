var BitmapText = require('./BitmapText');
var FactoryContainer = require('../../FactoryContainer');

var BitmapTextFactory = {

    KEY: 'bitmapText',

    add: function (x, y, font, text, size, align)
    {
        return this.children.add(new BitmapText(this.state, x, y, font, text, size, align));
    },

    make: function (x, y, font, text, size, align)
    {
        return new BitmapText(this.state, x, y, font, text, size, align);
    }

};

module.exports = FactoryContainer.register(BitmapTextFactory);
