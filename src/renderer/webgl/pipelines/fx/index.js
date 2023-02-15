/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Renderer.WebGL.Pipelines.FX
 */

var FX = {

    Bloom: require('./BloomFXPipeline'),
    Blur: require('./BlurFXPipeline'),
    Glow: require('./GlowFXPipeline'),
    Gradient: require('./GradientFXPipeline'),
    Pixelate: require('./PixelateFXPipeline'),
    Shadow: require('./ShadowFXPipeline'),
    Shine: require('./ShineFXPipeline'),
    Vignette: require('./VignetteFXPipeline')

};

//  Export it

module.exports = FX;
