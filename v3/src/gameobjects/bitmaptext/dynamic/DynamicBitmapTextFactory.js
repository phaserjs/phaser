var BitmapText = require('./DynamicBitmapText');
var FactoryContainer = require('../../FactoryContainer');

var DynamicBitmapTextFactory = {

    KEY: 'dynamicBitmapText',

    add: function (x, y, font, text, size, align)
    {
        return this.children.add(new BitmapText(this.state, x, y, font, text, size, align));
    },

    make: function (x, y, font, text, size, align)
    {
        return new BitmapText(this.state, x, y, font, text, size, align);
    }

};

module.exports = FactoryContainer.register(DynamicBitmapTextFactory);
