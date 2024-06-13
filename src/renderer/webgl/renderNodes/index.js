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
    RenderNode: require('./RenderNode'),
    SubmitterImage: require('./submitter/SubmitterImage'),
    SubmitterImageLight: require('./submitter/SubmitterImageLight'),
    TexturerImage: require('./texturer/TexturerImage'),
    TransformerImage: require('./transformer/TransformerImage')
};

module.exports = RenderNodes;
