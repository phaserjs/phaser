var Class = require('../../../utils/Class');
var Components = require('../../components');
var GameObject = require('../../GameObject');
var GetBitmapTextSize = require('../GetBitmapTextSize');
var ParseFromAtlas = require('../ParseFromAtlas');
var ParseRetroFont = require('../ParseRetroFont');
var Render = require('./BitmapTextRender');

var BitmapText = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Origin,
        Components.RenderTarget,
        Components.ScaleMode,
        Components.Texture,
        Components.Transform,
        Components.Visible,
        Components.ScrollFactor,
        Render
    ],

    initialize:

    function BitmapText (scene, x, y, font, text, size)
    {
        if (text === undefined) { text = ''; }

        GameObject.call(this, scene, 'BitmapText');

        this.font = font;

        var entry = this.scene.sys.cache.bitmapFont.get(font);

        this.fontData = entry.data;

        this.text = (Array.isArray(text)) ? text.join('\n') : text;

        this.fontSize = size || this.fontData.size;

        this.setTexture(entry.texture, entry.frame);
        this.setPosition(x, y);
        this.setOrigin(0, 0);

        this._bounds = this.getTextBounds();
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

    getTextBounds: function (round)
    {
        //  local = the BitmapText based on fontSize and 0x0 coords
        //  global = the BitmapText, taking into account scale and world position

        this._bounds = GetBitmapTextSize(this, round);

        return this._bounds;
    },

    width: {

        get: function ()
        {
            this.getTextBounds(false);
            return this._bounds.global.width;
        }

    },

    height: {

        get: function ()
        {
            this.getTextBounds(false);
            return this._bounds.global.height;
        }

    },

    toJSON: function ()
    {
        var out = Components.ToJSON(this);

        //  Extra data is added here

        var data = {
            font: this.font,
            text: this.text,
            fontSize: this.fontSize
        };

        out.data = data;

        return out;
    }

});

BitmapText.ParseRetroFont = ParseRetroFont;
BitmapText.ParseFromAtlas = ParseFromAtlas;

module.exports = BitmapText;
