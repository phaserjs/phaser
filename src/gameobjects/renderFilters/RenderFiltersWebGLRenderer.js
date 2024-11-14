/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TransformMatrix = require('../components/TransformMatrix');

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.RenderFilters#renderWebGL
 * @since 4.0.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.RenderFilters} src - The Game Object being rendered in this call.
 * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
 * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - This transform matrix is defined if the game object is nested
 */
var RenderFiltersWebGLRenderer = function (renderer, src, drawingContext, parentMatrix)
{
    var camera = drawingContext.camera;
    camera.addToRenderList(src);

    var innerCamera = src.camera;
    if (src.needsFocusContext || src.autoFocusContext)
    {
        src.focusOnChild(camera);
        src.needsFocusContext = false;
    }
    innerCamera.preRender();

    var customRenderNodes = src.customRenderNodes;
    var defaultRenderNodes = src.defaultRenderNodes;

    var child = src.child;
    var cameraNode = customRenderNodes.Camera || defaultRenderNodes.Camera;

    // Get transform.
    var transformMatrix = new TransformMatrix();
    var cameraMatrix = camera.matrix;

    var flipX = src.flipX ? -1 : 1;
    var flipY = src.flipY ? -1 : 1;

    transformMatrix.applyITRS(src.x, src.y, src.rotation, src.scaleX * flipX, src.scaleY * flipY);

    // Offset src origin.
    transformMatrix.translate(-src.width * src.originX, -src.height * src.originY);

    if (!src.decomposite)
    {
        // Apply camera.
        if (parentMatrix)
        {
            cameraMatrix = new TransformMatrix().copyFrom(camera.matrix);
            cameraMatrix.multiplyWithOffset(parentMatrix, -camera.scrollX * src.scrollFactorX, -camera.scrollY * src.scrollFactorY);

            // Undo the camera scroll.
            transformMatrix.e = src.x;
            transformMatrix.f = src.y;
        }
        else
        {
            transformMatrix.e -= camera.scrollX * src.scrollFactorX;
            transformMatrix.f -= camera.scrollY * src.scrollFactorY;
        }

        //  Multiply the camera by the transform, store result in transformMatrix
        cameraMatrix.multiply(transformMatrix, transformMatrix);
    }


    // Now we have the transform of the RenderFilters object.
    if (src.decomposite)
    {
        // Pass through to child.
        cameraNode.run(drawingContext, [ child ], camera, transformMatrix);
    }
    else
    {
        // Render child to framebuffer.
        cameraNode.run(drawingContext, [ child ], innerCamera, transformMatrix, true);
    }
};

module.exports = RenderFiltersWebGLRenderer;
