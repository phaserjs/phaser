var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../../components');
var Renderer = require('./BitmapTextRenderer')

var BitmapText = new Class({

    Mixins: [
        Components.Transform,
        Components.Texture,
        Components.Size,
        Components.Alpha,
        Components.BlendMode,
        Components.ScaleMode,
        Components.Visible,
        Renderer
    ],

    initialize:

    function BitmapText (state, x, y, key, text)
    {
        GameObject.call(this, state);

        this.text = typeof text === 'string' ? text : '';
        this.fontData = this.state.sys.cache.xml.get(key);
        
        this.setTexture(key, null);
        this.setPosition(x, y);
    }

});

module.exports = BitmapText;
