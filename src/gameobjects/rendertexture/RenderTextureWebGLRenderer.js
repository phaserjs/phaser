/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GameObject = require('../GameObject');
var Utils = require('../../renderer/webgl/Utils');

/**
 * Renders this Game Object with the Canvas Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.RenderTexture#renderWebgl
 * @since 3.2.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.GameObjects.RenderTexture} renderTexture - The Game Object being rendered in this call.
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var RenderTextureWebGLRenderer = function (renderer, renderTexture, interpolationPercentage, camera, parentMatrix)
{
    if (GameObject.RENDER_MASK !== renderTexture.renderFlags || (renderTexture.cameraFilter > 0 && (renderTexture.cameraFilter & camera._id)))
    {
        return;
    }

    this.pipeline.batchTexture(
        renderTexture,
        renderTexture.texture,
        renderTexture.texture.width, renderTexture.texture.height,
        renderTexture.x, renderTexture.y,
        renderTexture.width, renderTexture.height,
        renderTexture.scaleX, renderTexture.scaleY,
        renderTexture.rotation,
        renderTexture.flipX, !renderTexture.flipY,
        renderTexture.scrollFactorX, renderTexture.scrollFactorY,
        renderTexture.displayOriginX, renderTexture.displayOriginY,
        0, 0, renderTexture.texture.width, renderTexture.texture.height,
        Utils.getTintAppendFloatAlpha(renderTexture.tintTopLeft, renderTexture.alphaTopLeft), Utils.getTintAppendFloatAlpha(renderTexture.tintTopRight, renderTexture.alphaTopRight), Utils.getTintAppendFloatAlpha(renderTexture.tintBottomLeft, renderTexture.alphaBottomLeft), Utils.getTintAppendFloatAlpha(renderTexture.tintBottomRight, renderTexture.alphaBottomRight),
        0, 0,
        camera,
        parentMatrix
    );
};

module.exports = RenderTextureWebGLRenderer;
