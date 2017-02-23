
var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../../components');
var SpriteRender = require('./SpriteRender');

var Sprite = new Class({

    Mixins: [
        Components.Transform,
        Components.Texture,
        Components.Size,
        Components.Alpha,
        Components.BlendMode,
        Components.ScaleMode,
        Components.Visible,
        SpriteRender
    ],

    initialize:

    function Sprite (state, x, y, texture, frame)
    {
        GameObject.call(this, state);

        this.setPosition(x, y);
        this.setTexture(texture, frame);
    }

});

module.exports = Sprite;
