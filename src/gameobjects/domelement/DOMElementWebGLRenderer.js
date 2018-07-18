/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GameObject = require('../GameObject');

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Image#renderWebGL
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.Image} src - The Game Object being rendered in this call.
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var DOMElementWebGLRenderer = function (renderer, src, interpolationPercentage, camera, parentMatrix)
{
    var node = src.node;

    if (!node)
    {
        return;
    }

    // if (GameObject.RENDER_MASK !== src.renderFlags || (src.cameraFilter > 0 && (src.cameraFilter & camera.id)))
    // {
    //     return;
    // }

    var nodeBounds = node.getBoundingClientRect();

    // var x = nodeBounds.left + window.pageXOffset - document.documentElement.clientLeft;
    // var y = nodeBounds.top + window.pageYOffset - document.documentElement.clientTop;
    // bounds.width = nodeBounds.width;
    // bounds.height = nodeBounds.height;

    // https://developer.mozilla.org/en-US/docs/Web/CSS/transform
    // transform: translateX(10px) rotate(10deg) translateY(5px);

    node.style.opacity = src.alpha;

    node.style.zIndex = src._depth;

    node.style.transform = 'translateX(' + src.x + 'px) translateY(' + src.y + 'px) rotate(' + src.rotation + 'rad) scaleX(' + src.scaleX + ') scaleY(' + src.scaleY + ')';

    // node.style.left = src.x + 'px';
    // node.style.top = src.y + 'px';

};

module.exports = DOMElementWebGLRenderer;
