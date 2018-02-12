/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GameObject = require('../../GameObject');

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.DynamicBitmapText#renderWebGL
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.DynamicBitmapText} gameObject - The Game Object being rendered in this call.
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 */
var DynamicBitmapTextWebGLRenderer = function (renderer, bitmapText, interpolationPercentage, camera)
{
    var text = bitmapText.text;
    var textLength = text.length;

    if (GameObject.RENDER_MASK !== bitmapText.renderFlags || textLength === 0 || (bitmapText.cameraFilter > 0 && (bitmapText.cameraFilter & camera._id)))
    {
        return;
    }

    this.pipeline.batchDynamicBitmapText(bitmapText, camera);
};

module.exports = DynamicBitmapTextWebGLRenderer;
