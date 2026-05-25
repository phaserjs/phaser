/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Renderer.WebGL.RenderNodes
 */

var RenderNodes = {
    BaseFilter: require('./filters/BaseFilter'),
    BaseFilterShader: require('./filters/BaseFilterShader'),

    BatchHandler: require('./BatchHandler'),
    BatchHandlerPointLight: require('./BatchHandlerPointLight'),
    BatchHandlerQuad: require('./BatchHandlerQuad'),
    BatchHandlerQuadSingle: require('./BatchHandlerQuadSingle'),
    BatchHandlerStrip: require('./BatchHandlerStrip'),
    BatchHandlerTileSprite: require('./BatchHandlerTileSprite'),
    BatchHandlerTriFlat: require('./BatchHandlerTriFlat'),

    Camera: require('./Camera'),
    Defaults: require('./defaults'),
    DrawLine: require('./DrawLine'),
    DynamicTextureHandler: require('./DynamicTextureHandler'),
    FillCamera: require('./FillCamera'),
    FillPath: require('./FillPath'),
    FillRect: require('./FillRect'),
    FillTri: require('./FillTri'),

    FilterBarrel: require('./filters/FilterBarrel'),
    FilterBlend: require('./filters/FilterBlend'),
    FilterBlur: require('./filters/FilterBlur'),
    FilterBlurHigh: require('./filters/FilterBlurHigh'),
    FilterBlurLow: require('./filters/FilterBlurLow'),
    FilterBlurMed: require('./filters/FilterBlurMed'),
    FilterBokeh: require('./filters/FilterBokeh'),
    FilterColorMatrix: require('./filters/FilterColorMatrix'),
    FilterCombineColorMatrix: require('./filters/FilterCombineColorMatrix'),
    FilterDisplacement: require('./filters/FilterDisplacement'),
    FilterGlow: require('./filters/FilterGlow'),
    FilterGradientMap: require('./filters/FilterGradientMap'),
    FilterImageLight: require('./filters/FilterImageLight'),
    FilterKey: require('./filters/FilterKey'),
    FilterMask: require('./filters/FilterMask'),
    FilterNormalTools: require('./filters/FilterNormalTools'),
    FilterPanoramaBlur: require('./filters/FilterPanoramaBlur'),
    FilterParallelFilters: require('./filters/FilterParallelFilters'),
    FilterPixelate: require('./filters/FilterPixelate'),
    FilterQuantize: require('./filters/FilterQuantize'),
    FilterSampler: require('./filters/FilterSampler'),
    FilterShadow: require('./filters/FilterShadow'),
    FilterThreshold: require('./filters/FilterThreshold'),
    FilterVignette: require('./filters/FilterVignette'),
    FilterWipe: require('./filters/FilterWipe'),

    ListCompositor: require('./ListCompositor'),
    RebindContext: require('./RebindContext'),
    RenderNode: require('./RenderNode'),
    StrokePath: require('./StrokePath'),
    SubmitterMeshToQuad: require('./submitter/SubmitterMeshToQuad'),
    SubmitterQuad: require('./submitter/SubmitterQuad'),
    SubmitterSpriteGPULayer: require('./submitter/SubmitterSpriteGPULayer'),
    SubmitterTile: require('./submitter/SubmitterTile'),
    SubmitterTilemapGPULayer: require('./submitter/SubmitterTilemapGPULayer'),
    SubmitterTileSprite: require('./submitter/SubmitterTileSprite'),
    TexturerImage: require('./texturer/TexturerImage'),
    TexturerTileSprite: require('./texturer/TexturerTileSprite'),
    TransformerImage: require('./transformer/TransformerImage'),
    TransformerStamp: require('./transformer/TransformerStamp'),
    TransformerTile: require('./transformer/TransformerTile'),
    TransformerTileSprite: require('./transformer/TransformerTileSprite'),
    TransformerVertex: require('./transformer/TransformerVertex'),
    YieldContext: require('./YieldContext')
};

module.exports = RenderNodes;
