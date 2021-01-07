/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Utils = require('../../renderer/webgl/Utils');

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.RenderTexture#renderWebGL
 * @since 3.2.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.GameObjects.RenderTexture} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var RenderTextureWebGLRenderer = function (renderer, src, camera, parentMatrix)
{
    camera.addToRenderList(src);

    var cameraAlpha = camera.alpha;

    var renderTarget = src.renderTarget;
    var width = renderTarget.width;
    var height = renderTarget.height;

    var getTint = Utils.getTintAppendFloatAlpha;

    var pipeline = renderer.pipelines.set(src.pipeline);

    var textureUnit = pipeline.setTexture2D(renderTarget.texture);

    renderer.pipelines.preBatch(src);

    pipeline.batchTexture(
        src,
        renderTarget.texture,
        width, height,
        src.x, src.y,
        width, height,
        src.scaleX, src.scaleY,
        src.rotation,
        src.flipX, !src.flipY,
        src.scrollFactorX, src.scrollFactorY,
        src.displayOriginX, src.displayOriginY,
        0, 0, width, height,
        getTint(src.tintTopLeft, cameraAlpha * src._alphaTL),
        getTint(src.tintTopRight, cameraAlpha * src._alphaTR),
        getTint(src.tintBottomLeft, cameraAlpha * src._alphaBL),
        getTint(src.tintBottomRight, cameraAlpha * src._alphaBR),
        src.tintFill,
        0, 0,
        camera,
        parentMatrix,
        true,
        textureUnit
    );

    renderer.resetTextures();

    renderer.pipelines.postBatch(src);
};

module.exports = RenderTextureWebGLRenderer;
