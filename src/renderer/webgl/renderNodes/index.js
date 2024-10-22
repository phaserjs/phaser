/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Types.Renderer.WebGL.RenderNodes
 */

var RenderNodes = {
    BaseFilter: require('./filters/BaseFilter'),
    BaseFilterShader: require('./filters/BaseFilterShader'),

    BatchHandler: require('./BatchHandler'),
    BatchHandlerPointLight: require('./BatchHandlerPointLight'),
    BatchHandlerQuad: require('./BatchHandlerQuad'),
    BatchHandlerStrip: require('./BatchHandlerStrip'),
    BatchHandlerTileSprite: require('./BatchHandlerTileSprite'),
    BatchHandlerTriFlat: require('./BatchHandlerTriFlat'),
    Camera: require('./Camera'),
    DrawLine: require('./DrawLine'),
    DynamicTextureHandler: require('./DynamicTextureHandler'),
    FillCamera: require('./FillCamera'),
    FillPath: require('./FillPath'),
    FillRect: require('./FillRect'),
    FillTri: require('./FillTri'),

    FilterBlur: require('./filters/FilterBlur'),
    FilterBlurHigh: require('./filters/FilterBlurHigh'),
    FilterBlurLow: require('./filters/FilterBlurLow'),
    FilterBlurMed: require('./filters/FilterBlurMed'),
    FilterBokeh: require('./filters/FilterBokeh'),
    FilterDisplacement: require('./filters/FilterDisplacement'),
    FilterMask: require('./filters/FilterMask'),
    FilterPixelate: require('./filters/FilterPixelate'),
    FilterSampler: require('./filters/FilterSampler'),

    ListCompositor: require('./ListCompositor'),
    RebindContext: require('./RebindContext'),
    RenderNode: require('./RenderNode'),
    StrokePath: require('./StrokePath'),
    SubmitterQuad: require('./submitter/SubmitterQuad'),
    SubmitterTile: require('./submitter/SubmitterTile'),
    SubmitterTilemapGPULayer: require('./submitter/SubmitterTilemapGPULayer'),
    SubmitterTileSprite: require('./submitter/SubmitterTileSprite'),
    TexturerImage: require('./texturer/TexturerImage'),
    TexturerTileSprite: require('./texturer/TexturerTileSprite'),
    TransformerImage: require('./transformer/TransformerImage'),
    TransformerStamp: require('./transformer/TransformerStamp'),
    TransformerTile: require('./transformer/TransformerTile'),
    TransformerTileSprite: require('./transformer/TransformerTileSprite'),
    YieldContext: require('./YieldContext')
};

module.exports = RenderNodes;
