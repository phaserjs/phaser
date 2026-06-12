/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Renderer.WebGL.Shaders
 */

module.exports = {

    ApplyAlphaDiscard: require('./ApplyAlphaDiscard-glsl.js'),
    ApplyLighting: require('./ApplyLighting-glsl.js'),
    ApplyTint: require('./ApplyTint-glsl.js'),
    BoundedSampler: require('./BoundedSampler-glsl.js'),
    ColorMatrixFrag: require('./ColorMatrix-frag.js'),
    DefineBlockyTexCoord: require('./DefineBlockyTexCoord-glsl.js'),
    DefineLights: require('./DefineLights-glsl.js'),
    DefineTexCoordFrameClamp: require('./DefineTexCoordFrameClamp-glsl.js'),
    FilterBarrelFrag: require('./FilterBarrel-frag.js'),
    FilterBlendFrag: require('./FilterBlend-frag.js'),
    FilterBlockyFrag: require('./FilterBlocky-frag.js'),
    FilterBlurHighFrag: require('./FilterBlurHigh-frag.js'),
    FilterBlurLowFrag: require('./FilterBlurLow-frag.js'),
    FilterBlurMedFrag: require('./FilterBlurMed-frag.js'),
    FilterBokehFrag: require('./FilterBokeh-frag.js'),
    FilterColorMatrixFrag: require('./FilterColorMatrix-frag.js'),
    FilterCombineColorMatrixFrag: require('./FilterCombineColorMatrix-frag.js'),
    FilterDisplacementFrag: require('./FilterDisplacement-frag.js'),
    FilterGlowFrag: require('./FilterGlow-frag.js'),
    FilterGradientMapFrag: require('./FilterGradientMap-frag.js'),
    FilterImageLightFrag: require('./FilterImageLight-frag.js'),
    FilterKeyFrag: require('./FilterKey-frag.js'),
    FilterMaskFrag: require('./FilterMask-frag.js'),
    FilterNormalToolsFrag: require('./FilterNormalTools-frag.js'),
    FilterPanoramaBlurFrag: require('./FilterPanoramaBlur-frag.js'),
    FilterPixelateFrag: require('./FilterPixelate-frag.js'),
    FilterQuantizeFrag: require('./FilterQuantize-frag.js'),
    FilterShadowFrag: require('./FilterShadow-frag.js'),
    FilterThresholdFrag: require('./FilterThreshold-frag.js'),
    FilterVignetteFrag: require('./FilterVignette-frag.js'),
    FilterWipeFrag: require('./FilterWipe-frag.js'),
    FlatFrag: require('./Flat-frag.js'),
    FlatVert: require('./Flat-vert.js'),
    GetNormalFromMap: require('./GetNormalFromMap-glsl.js'),
    GetTexRes: require('./GetTexRes-glsl.js'),
    GetTexture: require('./GetTexture-glsl.js'),
    GradientFrag: require('./Gradient-frag.js'),
    MultiFrag: require('./Multi-frag.js'),
    MultiVert: require('./Multi-vert.js'),
    NoiseFrag: require('./Noise-frag.js'),
    NoiseSimplex2DFrag: require('./NoiseSimplex2D-frag.js'),
    NoiseSimplex3DFrag: require('./NoiseSimplex3D-frag.js'),
    NoiseWorley2DFrag: require('./NoiseWorley2D-frag.js'),
    NoiseWorley3DFrag: require('./NoiseWorley3D-frag.js'),
    NoiseWorley4DFrag: require('./NoiseWorley4D-frag.js'),
    OutInverseRotation: require('./OutInverseRotation-glsl.js'),
    PointLightFrag: require('./PointLight-frag.js'),
    PointLightVert: require('./PointLight-vert.js'),
    Ramp: require('./Ramp-glsl.js'),
    ShaderQuadFrag: require('./ShaderQuad-frag.js'),
    ShaderQuadVert: require('./ShaderQuad-vert.js'),
    SimpleTextureVert: require('./SimpleTexture-vert.js'),
    SpriteGPULayerFrag: require('./SpriteGPULayer-frag.js'),
    SpriteGPULayerVert: require('./SpriteGPULayer-vert.js'),
    TilemapGPULayerFrag: require('./TilemapGPULayer-frag.js'),
    TilemapGPULayerVert: require('./TilemapGPULayer-vert.js')

};
