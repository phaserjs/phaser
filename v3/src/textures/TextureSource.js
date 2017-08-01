var Class = require('../utils/Class');
var CONST = require('../const');
var IsSizePowerOfTwo = require('../math/pow2/IsSizePowerOfTwo');
var ScaleModes = require('../renderer/ScaleModes');

var TextureSource = new Class({

    initialize:

    function TextureSource (texture, source, width, height)
    {
        this.texture = texture;

        this.image = source;

        this.compressionAlgorithm = null;

        this.resolution = 1;
        
        this.width = width || source.naturalWidth || source.width || 0;

        this.height = height || source.naturalHeight || source.height || 0;

        this.scaleMode = ScaleModes.DEFAULT;

        //  USED?
        this.premultipliedAlpha = true;

        //  USED?
        this.mipmapLevel = 0;

        //  USED?
        this.renderable = true;

        //  USED?
        this.glTextureIndex = 0;

        //  USED?
        this.glDirty = true;

        //  USED?
        this.glLastUsed = 0;

        this.isPowerOf2 = IsSizePowerOfTwo(this.width, this.height);

        this.glTexture = null;

        var game = texture.manager.game;

        if (game.config.renderType === CONST.WEBGL)
        {
            game.renderer.createTexture(this, width, height);
        }

        if (game.config.pixelArt)
        {
            this.setFilter(1);
        }
    },

    setFilter: function (filterMode)
    {
        var game = this.texture.manager.game;

        if (game.config.renderType === CONST.WEBGL)
        {
            game.renderer.setTextureFilterMode(this.glTexture, filterMode);
        }
    }

});

module.exports = TextureSource;
