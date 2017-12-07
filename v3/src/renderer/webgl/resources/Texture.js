var Class = require('../../../utils/Class');

var Texture = new Class({

    initialize:

    function Texture (texture, width, height, pma)
    {
        this.texture = texture;
        this.width = width;
        this.height = height;
        this.isRenderTexture = false;
        this.isAlphaPremultiplied = pma;
    }

});

module.exports = Texture;
