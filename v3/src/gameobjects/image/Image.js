
var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../../components');
var ImageRender = require('./ImageRender');

var Image = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Flip,
        Components.GetBounds,
        Components.Origin,
        Components.RenderTarget,
        Components.ScaleMode,
        Components.Size,
        Components.Texture,
        Components.Transform,
        Components.Visible,
        ImageRender
    ],

    initialize:

    function Image (state, x, y, texture, frame)
    {
        GameObject.call(this, state, 'Image');

        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setOrigin();
    }

});

module.exports = Image;
