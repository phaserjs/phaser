
var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../../components');
var TextRender = require('./TextRender');
var TextStyle = require('../TextStyle');

var Text = new Class({

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.GetBounds,
        Components.Origin,
        Components.ScaleMode,
        Components.Size,
        Components.Transform,
        Components.Visible,
        TextRender
    ],

    initialize:

    function Image (state, x, y, text, style)
    {
        GameObject.call(this, state);

        this.setPosition(x, y);

        //  Create canvas texture

        // this.texture = this.state.sys.textures.get(key);
        // this.frame = this.texture.get(frame);

    }

});

module.exports = Text;
