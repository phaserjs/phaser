/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Types.Renderer.WebGL.RenderNodes
 */

var RenderNodes = {
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
