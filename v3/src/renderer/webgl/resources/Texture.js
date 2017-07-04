var Class = require('../../../utils/Class');

var Texture = new Class({

    initialize:

    function Texture (texture, width, height)
    {
        this.texture = texture;
        this.width = width;
        this.height = height;
        this.isRenderTexture = false;
    }

});

module.exports = Texture;
