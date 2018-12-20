/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var SetTransform = require('../../../../src/renderer/canvas/utils/SetTransform');

/**
 * Renders this Game Object with the Canvas Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.SpineGameObject#renderCanvas
 * @since 3.16.0
 * @private
 *
 * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.GameObjects.SpineGameObject} src - The Game Object being rendered in this call.
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var SpineGameObjectCanvasRenderer = function (renderer, src, interpolationPercentage, camera, parentMatrix)
{
    var context = renderer.currentContext;

    var plugin = src.plugin;
    var skeleton = src.skeleton;
    var skeletonRenderer = plugin.skeletonRenderer;

    if (!skeleton || !SetTransform(renderer, context, src, camera, parentMatrix))
    {
        return;
    }

    skeletonRenderer.ctx = context;

    context.save();

    skeletonRenderer.draw(skeleton);

    if (plugin.drawDebug || src.drawDebug)
    {
        context.strokeStyle = '#00ff00';
        context.beginPath();
        context.moveTo(-1000, 0);
        context.lineTo(1000, 0);
        context.moveTo(0, -1000);
        context.lineTo(0, 1000);
        context.stroke();
    }

    context.restore();
};

module.exports = SpineGameObjectCanvasRenderer;
