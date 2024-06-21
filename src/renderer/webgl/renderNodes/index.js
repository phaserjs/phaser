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
    BatchHandlerTriFlat: require('./BatchHandlerTriFlat'),
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
    SubmitterQuad: require('./submitter/SubmitterQuad'),
    SubmitterQuadLight: require('./submitter/SubmitterQuadLight'),
    TexturerImage: require('./texturer/TexturerImage'),
    TransformerImage: require('./transformer/TransformerImage'),
    YieldContext: require('./YieldContext')
};

module.exports = RenderNodes;
