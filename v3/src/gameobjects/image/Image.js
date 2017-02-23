
var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../../components');
var ImageRender = require('./ImageRender');

var Image = new Class({

    Mixins: [
        Components.Transform,
        Components.Texture,
        Components.Size,
        Components.Alpha,
        Components.BlendMode,
        Components.ScaleMode,
        Components.Visible,
        Components.GetBounds,
        ImageRender
    ],

    initialize:

    function Image (state, x, y, texture, frame)
    {
        GameObject.call(this, state);

        this.setPosition(x, y);
        this.setTexture(texture, frame);
    }

});

module.exports = Image;
