var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var SpriteRender = require('./SpriteRender');

var Sprite = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Flip,
        Components.GetBounds,
        Components.Origin,
        Components.Pipeline,
        Components.ScaleMode,
        Components.ScrollFactor,
        Components.Size,
        Components.Texture,
        Components.Tint,
        Components.Transform,
        Components.Visible,
        SpriteRender
    ],

    initialize:

    function Sprite (scene, x, y, texture, frame)
    {
        GameObject.call(this, scene, 'Sprite');

        this.anims = new Components.Animation(this);

        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setOrigin();
        this.initPipeline('TextureTintPipeline');
    },

    preUpdate: function (time, delta)
    {
        this.anims.update(time, delta);
    },

    play: function (key, ignoreIfPlaying, startFrame)
    {
        this.anims.play(key, ignoreIfPlaying, startFrame);

        return this;
    },

    toJSON: function ()
    {
        var data = Components.ToJSON(this);

        //  Extra Sprite data is added here

        return data;
    }

});

module.exports = Sprite;
