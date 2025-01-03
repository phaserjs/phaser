/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Renderer.WebGL.Pipelines.FX
 */

var FX = {

    Barrel: require('./BarrelFXPipeline'),
    Bloom: require('./BloomFXPipeline'),
    Blur: require('./BlurFXPipeline'),
    Bokeh: require('./BokehFXPipeline'),
    Circle: require('./CircleFXPipeline'),
    ColorMatrix: require('./ColorMatrixFXPipeline'),
    Displacement: require('./DisplacementFXPipeline'),
    Glow: require('./GlowFXPipeline'),
    Gradient: require('./GradientFXPipeline'),
    Pixelate: require('./PixelateFXPipeline'),
    Shadow: require('./ShadowFXPipeline'),
    Shine: require('./ShineFXPipeline'),
    Vignette: require('./VignetteFXPipeline'),
    Wipe: require('./WipeFXPipeline')

};

//  Export it

module.exports = FX;
