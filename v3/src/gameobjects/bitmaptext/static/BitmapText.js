var Class = require('../../../utils/Class');
var GameObject = require('../../GameObject');
var Components = require('../../../components');
var Render = require('./BitmapTextRender');
var GetBitmapTextSize = require('../GetBitmapTextSize');

var BitmapText = new Class({

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Origin,
        Components.Size,
        Components.Texture,
        Components.Transform,
        Components.Visible,
        Components.Render
    ],

    initialize:

    function BitmapText (state, x, y, font, text, size, align)
    {
        if (text === undefined) { text = ''; }
        if (size === undefined) { size = 32; }
        if (align === undefined) { align = 'left'; }

        GameObject.call(this, state);

        this.fontData = this.state.sys.cache.bitmapFont.get(font);

        this.text = text;

        this.fontSize = size;

        this.setTexture(font);
        this.setPosition(x, y);
        this.setOrigin(0, 0);
    },

    setFontSize: function (size)
    {
        this.fontSize = size;

        return this;
    },

    setText: function (text)
    {
        this.text = text;

        return this;
    },

    // {
    //     local: {
    //         x,
    //         y,
    //         width,
    //         height
    //     },
    //     global: {
    //         x,
    //         y,
    //         width,
    //         height
    //     }
    // }

    getTextBounds: function ()
    {
        //  local = the BitmapText based on fontSize and 0x0 coords
        //  global = the BitmapText, taking into account scale and world position

        return GetBitmapTextSize(this);
    }

});

module.exports = BitmapText;
