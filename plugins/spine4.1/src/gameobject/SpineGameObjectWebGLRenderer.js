/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Clamp = require('../../../../src/math/Clamp');
var GetCalcMatrix = require('../../../../src/gameobjects/GetCalcMatrix');

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method SpineGameObject#renderWebGL
 * @since 3.19.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {SpineGameObject} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 * @param {SpineContainer} [container] - If this Spine object is in a Spine Container, this is a reference to it.
 */
var SpineGameObjectWebGLRenderer = function (renderer, src, camera, parentMatrix, container)
{
    var plugin = src.plugin;
    var skeleton = src.skeleton;
    var sceneRenderer = plugin.sceneRenderer;

    if (renderer.newType)
    {
        //  flush + clear previous pipeline if this is a new type
        renderer.pipelines.clear();

        sceneRenderer.begin();
    }

    var scrollFactorX = src.scrollFactorX;
    var scrollFactorY = src.scrollFactorY;
    var alpha = skeleton.color.a;

    if (container)
    {
        src.scrollFactorX = container.scrollFactorX;
        src.scrollFactorY = container.scrollFactorY;

        skeleton.color.a = Clamp(alpha * container.alpha, 0, 1);
    }

    camera.addToRenderList(src);

    var calcMatrix = GetCalcMatrix(src, camera, parentMatrix).calc;

    var viewportHeight = renderer.height;

    //  從 calcMatrix 提取 2D 仿射變換參數。
    //  為什麼不直接設定 skeleton.scaleX/scaleY：直接設定會汙染 Spine 內部的
    //  slot transform（path constraint、mesh attachment 等），導致渲染異常。
    //  改為在下方 drawSkeleton 的 vertex callback 中對每個頂點套用完整變換。
    var a = calcMatrix.a;
    var b = calcMatrix.b;
    var c = calcMatrix.c;
    var d = calcMatrix.d;
    var tx = calcMatrix.tx;
    var ty = viewportHeight - calcMatrix.ty;

    //  將 skeleton 位置歸零，使 updateWorldTransform 以原點為基礎計算頂點座標。
    //  實際螢幕位置透過 vertex callback 中的 tx/ty 套用。
    skeleton.x = 0;
    skeleton.y = 0;

    skeleton.updateWorldTransform();

    //  Draw the current skeleton

    sceneRenderer.drawSkeleton(skeleton, src.preMultipliedAlpha, -1, -1, function (vertices, numVertices, stride)
    {
        for (var i = 0; i < numVertices; i += stride)
        {
            var vx = vertices[i];

            //  Y 軸取反：Spine 使用 Y-up 座標系，Phaser/WebGL 使用 Y-down
            var vy = -vertices[i + 1];
            vertices[i] = vx * a + vy * c + tx;
            vertices[i + 1] = -(vx * b + vy * d - ty);
        }
    });

    if (container)
    {
        src.scrollFactorX = scrollFactorX;
        src.scrollFactorY = scrollFactorY;
        skeleton.color.a = alpha;
    }

    if (plugin.drawDebug || src.drawDebug)
    {
        //  Because if we don't, the bones render positions are completely wrong (*sigh*)
        var oldX = skeleton.x;
        var oldY = skeleton.y;

        skeleton.x = 0;
        skeleton.y = 0;

        sceneRenderer.drawSkeletonDebug(skeleton, src.preMultipliedAlpha);

        skeleton.x = oldX;
        skeleton.y = oldY;
    }

    if (!renderer.nextTypeMatch)
    {
        //  The next object in the display list is not a Spine Game Object or Spine Container, so we end the batch
        sceneRenderer.end();

        //  And rebind the previous pipeline
        renderer.pipelines.rebind();
    }
};

module.exports = SpineGameObjectWebGLRenderer;
