/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
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

    if (camera.camera)
    {
        // `camera` is really a DrawingContext object, used in WebGL rendering.
        camera = camera.camera;
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

    var dx = src.width * src.originX;
    var dy = src.height * src.originY;

    var tx = '0%';
    var ty = '0%';

    camMatrix.copyWithScrollFactorFrom(
        camera.matrix,
        camera.scrollX, camera.scrollY,
        src.scrollFactorX, src.scrollFactorY
    );

    if (parentMatrix)
    {
        camMatrix.multiply(parentMatrix);
        dx *= src.scaleX;
        dy *= src.scaleY;
    }
    else
    {
        tx = (100 * src.originX) + '%';
        ty = (100 * src.originY) + '%';
    }

    camMatrix.translate(-dx, -dy);

    srcMatrix.applyITRS(
        src.x, src.y,
        src.rotation,
        src.scaleX, src.scaleY
    );

    camMatrix.multiply(srcMatrix, calcMatrix);

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
