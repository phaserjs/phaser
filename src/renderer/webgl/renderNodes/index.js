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
    BatchHandlerQuadLight: require('./BatchHandlerQuadLight'),
    BatchHandlerQuadLightShadow: require('./BatchHandlerQuadLightShadow'),
    BatchHandlerStrip: require('./BatchHandlerStrip'),
    BatchHandlerTileSprite: require('./BatchHandlerTileSprite'),
    BatchHandlerTileSpriteLight: require('./BatchHandlerTileSpriteLight'),
    BatchHandlerTriFlat: require('./BatchHandlerTriFlat'),
    BatchHandlerTriFlatLight: require('./BatchHandlerTriFlatLight'),
    Camera: require('./Camera'),
    DrawLine: require('./DrawLine'),
    FillCamera: require('./FillCamera'),
    FillPath: require('./FillPath'),
    FillRect: require('./FillRect'),
    FillTri: require('./FillTri'),
    ListCompositor: require('./ListCompositor'),
    RebindContext: require('./RebindContext'),
    RenderNode: require('./RenderNode'),
    StrokePath: require('./StrokePath'),
    SubmitterImageGPULayer: require('./submitter/SubmitterImageGPULayer'),
    SubmitterQuad: require('./submitter/SubmitterQuad'),
    SubmitterQuadLight: require('./submitter/SubmitterQuadLight'),
    SubmitterTileSprite: require('./submitter/SubmitterTileSprite'),
    SubmitterTileSpriteLight: require('./submitter/SubmitterTileSpriteLight'),
    TexturerImage: require('./texturer/TexturerImage'),
    TexturerTileSprite: require('./texturer/TexturerTileSprite'),
    TransformerImage: require('./transformer/TransformerImage'),
    TransformerTile: require('./transformer/TransformerTile'),
    TransformerTileSprite: require('./transformer/TransformerTileSprite'),
    YieldContext: require('./YieldContext')
};

module.exports = RenderNodes;
