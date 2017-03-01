var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../../components');
var Render = require('./BitmapTextRender');

var BitmapText = new Class({

    Mixins: [
        Components.Transform,
        Components.Texture,
        Components.Size,
        Components.Alpha,
        Components.BlendMode,
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

        //  Setting these will enable the Size component to work
        //  then anchorX etc will work too
        // this.frame.realWidth = 0;
        // this.frame.realHeight = 0;

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
        // this._text = text;
        // this.dirty = true;

        return this;
    }

});

module.exports = BitmapText;
