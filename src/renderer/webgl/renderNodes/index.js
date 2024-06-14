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
    BatchHandlerQuad: require('./BatchHandlerQuad'),
    BatchHandlerQuadLight: require('./BatchHandlerQuadLight'),
    Camera: require('./Camera'),
    FillCamera: require('./FillCamera'),
    FillRect: require('./FillRect'),
    ListCompositor: require('./ListCompositor'),
    RebindContext: require('./RebindContext'),
    RenderNode: require('./RenderNode'),
    SubmitterQuad: require('./submitter/SubmitterQuad'),
    SubmitterQuadLight: require('./submitter/SubmitterQuadLight'),
    TexturerImage: require('./texturer/TexturerImage'),
    TransformerImage: require('./transformer/TransformerImage'),
    YieldContext: require('./YieldContext')
};

module.exports = RenderNodes;
