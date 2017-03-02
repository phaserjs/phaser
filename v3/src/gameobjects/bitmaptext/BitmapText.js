var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../../components');
var Render = require('./BitmapTextRender');
var GetBitmapTextSize = require('./GetBitmapTextSize');

var BitmapText = new Class({

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Origin,
        Components.Size,
        Components.Texture,
        Components.Transform,
        Components.Visible,
        Render
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

        this.displayCallback;

        this.setTexture(font);
        this.setPosition(x, y);
    },

    setDisplayCallback: function (callback)
    {
        this.displayCallback = callback;

        return this;
    },

    setText: function (text)
    {
        this.text = text;

        return this;
    },

    getTextBounds: function ()
    {
        var size = GetBitmapTextSize(this);

        return { x: this.x + size.x, y: this.y + size.y, width: size.width, height: size.height };
    }

});

module.exports = BitmapText;
