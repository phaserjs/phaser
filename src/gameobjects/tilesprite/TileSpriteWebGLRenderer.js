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
 * @method Phaser.GameObjects.TileSprite#renderWebGL
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.TileSprite} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var TileSpriteWebGLRenderer = function (renderer, src, camera, parentMatrix)
{
    src.updateCanvas();

    var width = src.width;
    var height = src.height;
    if (width === 0 || height === 0)
    {
        return;
    }

    renderer.pipelines.preBatch(src);

    var getTint = Utils.getTintAppendFloatAlpha;

    var pipeline = renderer.pipelines.set(src.pipeline, src);

    var textureUnit = pipeline.setTexture2D(src.fillPattern, src);

    pipeline.batchTexture(
        src,
        src.fillPattern,
        src.displayFrame.width * src.tileScaleX, src.displayFrame.height * src.tileScaleY,
        src.x, src.y,
        width, height,
        src.scaleX, src.scaleY,
        src.rotation,
        src.flipX, src.flipY,
        src.scrollFactorX, src.scrollFactorY,
        src.originX * width, src.originY * height,
        0, 0, width, height,
        getTint(src.tintTopLeft, camera.alpha * src._alphaTL),
        getTint(src.tintTopRight, camera.alpha * src._alphaTR),
        getTint(src.tintBottomLeft, camera.alpha * src._alphaBL),
        getTint(src.tintBottomRight, camera.alpha * src._alphaBR),
        src.tintFill,
        (src.tilePositionX % src.displayFrame.width) / src.displayFrame.width,
        (src.tilePositionY % src.displayFrame.height) / src.displayFrame.height,
        camera,
        parentMatrix,
        false,
        textureUnit
    );

    renderer.pipelines.postBatch(src);
};

module.exports = TileSpriteWebGLRenderer;
