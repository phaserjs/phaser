/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CSSBlendModes = require('./CSSBlendModes');
var GameObject = require('../GameObject');
var TransformMatrix = require('../components/TransformMatrix');

var tempMatrix1 = new TransformMatrix();
var tempMatrix2 = new TransformMatrix();
var tempMatrix3 = new TransformMatrix();

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.DOMElement#renderWebGL
 * @since 3.17.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active renderer.
 * @param {Phaser.GameObjects.DOMElement} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var DOMElementCSSRenderer = function (renderer, src, camera, parentMatrix)
{
    if (!src.node)
    {
        return;
    }

    var style = src.node.style;
    var settings = src.scene.sys.settings;

    if (!style || !settings.visible || GameObject.RENDER_MASK !== src.renderFlags || (src.cameraFilter !== 0 && (src.cameraFilter & camera.id)) || (src.parentContainer && !src.parentContainer.willRender()))
    {
        style.display = 'none';

        return;
    }

    var parent = src.parentContainer;
    var alpha = camera.alpha * src.alpha;

    if (parent)
    {
        alpha *= parent.alpha;
    }

    var camMatrix = tempMatrix1;
    var srcMatrix = tempMatrix2;
    var calcMatrix = tempMatrix3;

    var dx = 0;
    var dy = 0;

    var tx = '0%';
    var ty = '0%';

    if (parentMatrix)
    {
        dx = (src.width * src.scaleX) * src.originX;
        dy = (src.height * src.scaleY) * src.originY;

        srcMatrix.applyITRS(src.x - dx, src.y - dy, src.rotation, src.scaleX, src.scaleY);

        camMatrix.copyFrom(camera.matrix);

        //  Multiply the camera by the parent matrix
        camMatrix.multiplyWithOffset(parentMatrix, -camera.scrollX * src.scrollFactorX, -camera.scrollY * src.scrollFactorY);

        //  Undo the camera scroll
        srcMatrix.e = src.x - dx;
        srcMatrix.f = src.y - dy;

        //  Multiply by the src matrix, store result in calcMatrix
        camMatrix.multiply(srcMatrix, calcMatrix);
    }
    else
    {
        dx = (src.width) * src.originX;
        dy = (src.height) * src.originY;

        srcMatrix.applyITRS(src.x, src.y, src.rotation, src.scaleX, src.scaleY);

        camMatrix.copyFrom(camera.matrix);

        tx = (100 * src.originX) + '%';
        ty = (100 * src.originY) + '%';

        srcMatrix.e -= camera.scrollX * src.scrollFactorX;
        srcMatrix.f -= camera.scrollY * src.scrollFactorY;

        //  Multiply by the src matrix, store result in calcMatrix
        camMatrix.multiply(srcMatrix, calcMatrix);

        calcMatrix.e -= dx;
        calcMatrix.f -= dy;
    }

    if (!src.transformOnly)
    {
        style.display = 'block';
        style.opacity = alpha;
        style.zIndex = src._depth;
        style.pointerEvents = src.pointerEvents;
        style.mixBlendMode = CSSBlendModes[src._blendMode];
    }

    // https://developer.mozilla.org/en-US/docs/Web/CSS/transform

    style.transform =
        calcMatrix.getCSSMatrix() +
        ' skew(' + src.skewX + 'rad, ' + src.skewY + 'rad)' +
        ' rotate3d(' + src.rotate3d.x + ',' + src.rotate3d.y + ',' + src.rotate3d.z + ',' + src.rotate3d.w + src.rotate3dAngle + ')';

    style.transformOrigin = tx + ' ' + ty;
};

module.exports = DOMElementCSSRenderer;
