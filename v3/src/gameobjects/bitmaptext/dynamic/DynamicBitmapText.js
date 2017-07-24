var Class = require('../../../utils/Class');
var GameObject = require('../../GameObject');
var Components = require('../../components');
var Render = require('./DynamicBitmapTextRender');
var GetBitmapTextSize = require('../GetBitmapTextSize');

var DynamicBitmapText = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Origin,
        Components.RenderTarget,
        Components.Texture,
        Components.Tint,
        Components.Transform,
        Components.Visible,
        Components.ScrollFactor,
        Render
    ],

    initialize:

    function DynamicBitmapText (scene, x, y, font, text, size)
    {
        if (text === undefined) { text = ''; }

        GameObject.call(this, scene, 'DynamicBitmapText');

        this.font = font;

        var entry = this.scene.sys.cache.bitmapFont.get(font);

        this.fontData = entry.data;

        this.text = (Array.isArray(text)) ? text.join('\n') : text;

        this.fontSize = size || this.fontData.size;

        this.setTexture(entry.texture, entry.frame);
        this.setPosition(x, y);
        this.setOrigin(0, 0);

        this._bounds = this.getTextBounds();

        this.scrollX = 0;
        this.scrollY = 0;

        this.width = 0;
        this.height = 0;

        this.displayCallback;
    },

    setSize: function (width, height)
    {
        this.width = width;
        this.height = height;

        return this;
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

    setScrollX: function (value)
    {
        this.scrollX = value;

        return this;
    },

    setScrollY: function (value)
    {
        this.scrollY = value;

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
