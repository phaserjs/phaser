/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Image#renderWebGL
 * @since 4.NEXT
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.Mesh2D} src - The Game Object being rendered in this call.
 * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var Mesh2DWebGLRenderer = function (renderer, src, drawingContext, parentMatrix)
{
    drawingContext.camera.addToRenderList(src);

    var customRenderNodes = src.customRenderNodes;
    var defaultRenderNodes = src.defaultRenderNodes;

    var transformerNode = customRenderNodes.Transformer || defaultRenderNodes.Transformer;
    var submitterNode = customRenderNodes.Submitter || defaultRenderNodes.Submitter;

    if (src.renderAsTriangles)
    {
        // Render each triangle individually, rather than combining triangles
        // into quads. Suitable for dynamic topology which cannot be optimized.
        var triangleNode = customRenderNodes.BatchHandlerTriangles || defaultRenderNodes.BatchHandlerTriangles;

        // Resolve render options (lighting, smooth pixel art, etc.) using the
        // submitter, then hand the raw vertex and index arrays to the triangle
        // batch handler.
        submitterNode.setRenderOptions(src);

        triangleNode.batchTriangles(
            drawingContext,
            src,
            parentMatrix,
            transformerNode,
            src.vertices,
            src.indices,
            submitterNode._renderOptions
        );

        return;
    }

    submitterNode.run(
        drawingContext,
        src,
        parentMatrix,
        transformerNode
    );
};

module.exports = Mesh2DWebGLRenderer;
