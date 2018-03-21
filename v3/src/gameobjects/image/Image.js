
var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../../components');

var Image = new Class({

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Flip,
        Components.GetBounds,
        Components.Origin,
        Components.ScaleMode,
        Components.Size,
        Components.Texture,
        Components.Transform,
        Components.Visible,
        Components.Render
    ],

    initialize:

    function Image (state, x, y, texture, frame)
    {
        GameObject.call(this, state);

        this.renderer = new state.
                            game.
                            renderDevice.
                            rendererList.
                            TextureRenderer(state.game, 1);

        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setOrigin();
    }

});

module.exports = Image;
