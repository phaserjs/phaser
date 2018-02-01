
var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../components');
var ImageRender = require('./ImageRender');

var Image = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Depth,
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
        ImageRender
    ],

    initialize:

    function Image (scene, x, y, texture, frame)
    {
        GameObject.call(this, scene, 'Image');

        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setOrigin();
        this.initPipeline('TextureTintPipeline');
    }

});

module.exports = Image;
