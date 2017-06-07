var Class = require('../../../utils/Class');
var GameObject = require('../../GameObject');
var Components = require('../../../components');
var Render = require('./DynamicBitmapTextRender');
var GetBitmapTextSize = require('../GetBitmapTextSize');

var DynamicBitmapText = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Origin,
        Components.RenderTarget,
        Components.Size,
        Components.Texture,
        Components.Transform,
        Components.Visible,
        Render
    ],

    initialize:

    function DynamicBitmapText (state, x, y, font, text, size, align)
    {
        if (text === undefined) { text = ''; }
        if (align === undefined) { align = 'left'; }

        GameObject.call(this, state, 'DynamicBitmapText');

        this.fontData = this.state.sys.cache.bitmapFont.get(font);

        this.text = text;

        this.fontSize = size || this.fontData.size;

        this._scrollX = 0;
        this._scrollY = 0;
        this._maxWidth = 0;
        this._maxHeight = 0;

        this.displayCallback;

        this.setTexture(font);
        this.setPosition(x, y);
    },

    setDisplayCallback: function (callback)
    {
        this.displayCallback = callback;

        return this;
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

    setMaxWidth: function (value)
    {
        this._maxWidth = value;

        return this;
    },

    setMaxHeight: function (value)
    {
        this._maxHeight = value;

        return this;
    },

    setScrollX: function (value)
    {
        this._scrollX = value;

        return this;
    },

    setScrollY: function (value)
    {
        this._scrollY = value;

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

module.exports = DynamicBitmapText;
