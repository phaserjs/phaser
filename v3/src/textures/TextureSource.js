var Class = require('../utils/Class');
var CONST = require('../const');
var IsSizePowerOfTwo = require('../math/pow2/IsSizePowerOfTwo');
var ScaleModes = require('../renderer/ScaleModes');

var TextureSource = new Class({

    initialize:

    function TextureSource (texture, source, width, height)
    {
        var game = texture.manager.game;

        this.texture = texture;

        this.image = source;

        this.compressionAlgorithm = null;

        this.resolution = 1;
        
        this.width = width || source.naturalWidth || source.width || 0;

        this.height = height || source.naturalHeight || source.height || 0;

        this.scaleMode = ScaleModes.DEFAULT;

        this.isCanvas = (source instanceof HTMLCanvasElement);

        this.isPowerOf2 = IsSizePowerOfTwo(this.width, this.height);

        this.init(game);
    },

    init: function (game)
    {
        this.glTexture = null;

        if (game.config.renderType === CONST.WEBGL)
        {
            game.renderer.createTexture(this, this.width, this.height);
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
