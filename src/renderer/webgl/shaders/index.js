/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Renderer.WebGL.Shaders
 */

module.exports = {

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
    FilterDisplacementFrag: require('./FilterDisplacement-frag.js'),
    FilterGlowFrag: require('./FilterGlow-frag.js'),
    FilterMaskFrag: require('./FilterMask-frag.js'),
    FilterPixelateFrag: require('./FilterPixelate-frag.js'),
    FilterShadowFrag: require('./FilterShadow-frag.js'),
    FilterThresholdFrag: require('./FilterThreshold-frag.js'),
    FlatFrag: require('./Flat-frag.js'),
    FlatVert: require('./Flat-vert.js'),
    GetNormalFromMap: require('./GetNormalFromMap-glsl.js'),
    GetTexRes: require('./GetTexRes-glsl.js'),
    GetTexture: require('./GetTexture-glsl.js'),
    MultiFrag: require('./Multi-frag.js'),
    MultiVert: require('./Multi-vert.js'),
    OutInverseRotation: require('./OutInverseRotation-glsl.js'),
    PointLightFrag: require('./PointLight-frag.js'),
    PointLightVert: require('./PointLight-vert.js'),
    ShaderQuadFrag: require('./ShaderQuad-frag.js'),
    ShaderQuadVert: require('./ShaderQuad-vert.js'),
    SimpleTextureVert: require('./SimpleTexture-vert.js'),
    SpriteGPULayerFrag: require('./SpriteGPULayer-frag.js'),
    SpriteGPULayerVert: require('./SpriteGPULayer-vert.js'),
    TilemapGPULayerFrag: require('./TilemapGPULayer-frag.js'),
    TilemapGPULayerVert: require('./TilemapGPULayer-vert.js')

};
