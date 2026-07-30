/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TransformMatrix = require('../../gameobjects/components/TransformMatrix');

var tempMatrix = new TransformMatrix();

/**
 * Renders this Game Object with the Canvas Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Stamp#renderCanvas
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.GameObjects.Stamp} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 */
var StampCanvasRenderer = function (renderer, src, camera)
{
    camera.addToRenderList(src);

    tempMatrix.copyFrom(camera.matrix);
    camera.matrix.loadIdentity();
    var scrollX = camera.scrollX;
    var scrollY = camera.scrollY;
    camera.scrollX = 0;
    camera.scrollY = 0;

    renderer.batchSprite(src, src.frame, camera);

    camera.scrollX = scrollX;
    camera.scrollY = scrollY;
    camera.matrix.copyFrom(tempMatrix);
};

module.exports = StampCanvasRenderer;
