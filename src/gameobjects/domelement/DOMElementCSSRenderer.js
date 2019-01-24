/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CSSBlendModes = require('./CSSBlendModes');
var GameObject = require('../GameObject');

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.DOMElement#renderWebGL
 * @since 3.12.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active renderer.
 * @param {Phaser.GameObjects.DOMElement} src - The Game Object being rendered in this call.
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 */
var DOMElementCSSRenderer = function (renderer, src, interpolationPercentage, camera)
{
    var node = src.node;

    if (!node || GameObject.RENDER_MASK !== src.renderFlags || (src.cameraFilter !== 0 && (src.cameraFilter & camera.id)))
    {
        if (node)
        {
            node.style.display = 'none';
        }
        
        return;
    }

    var camMatrix = renderer._tempMatrix1;
    var spriteMatrix = renderer._tempMatrix2;
    var calcMatrix = renderer._tempMatrix3;

    var x = src.originX * src.width;
    var y = src.originY * src.height;

    spriteMatrix.applyITRS(src.x - x - (camera.scrollX * src.scrollFactorX), src.y - y - (camera.scrollY * src.scrollFactorY), src.rotation, src.scaleX, src.scaleY);

    camMatrix.copyFrom(camera.matrix);
    
    camMatrix.multiply(spriteMatrix, calcMatrix);

    node.style.display = 'block';
    node.style.opacity = src.alpha;
    node.style.zIndex = src._depth;
    node.style.pointerEvents = 'auto';
    node.style.mixBlendMode = CSSBlendModes[src._blendMode];

    // https://developer.mozilla.org/en-US/docs/Web/CSS/transform

    node.style.transform =
        calcMatrix.getCSSMatrix() +
        ' skew(' + src.skewX + 'rad, ' + src.skewY + 'rad)' +
        ' rotate3d(' + src.rotate3d.x + ',' + src.rotate3d.y + ',' + src.rotate3d.z + ',' + src.rotate3d.w + src.rotate3dAngle + ')';

    // node.style.transform = calcMatrix.getCSSMatrix();

    node.style.transformOrigin = (100 * src.originX) + '% ' + (100 * src.originY) + '%';
};

module.exports = DOMElementCSSRenderer;
