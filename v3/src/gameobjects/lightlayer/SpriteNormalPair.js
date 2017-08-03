var Class = require('../../utils/Class');

var SpriteNormalPair = new Class({

    initialize:

    function SpriteNormalPair (sprite, normalTexture)
    {
        this.spriteRef = sprite;
        this.normalTextureRef = normalTexture;
    },

    set: function (sprite, normalTexture)
    {
        this.spriteRef = sprite;
        this.normalTextureRef = normalTexture;
    }

});

module.exports = SpriteNormalPair;
