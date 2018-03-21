var WebGLTextureRenderer = require('./webgl/renderer/TextureRenderer');
var GlobalCommandList = require('./GlobalCommandList');

var RendererList = function (game)
{
    this.TextureRenderer = null;
    this.GraphicsRenderer = null;
    this.BlitterRenderer = null;

    if (game.config.renderType === Phaser.WEBGL)
    {
        this.TextureRenderer = WebGLTextureRenderer;
    }

};

module.exports = RendererList;
