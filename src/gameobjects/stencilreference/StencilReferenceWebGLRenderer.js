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
 * @method Phaser.GameObjects.StencilReference#renderWebGL
 * @since 4.NEXT
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.StencilReference} src - The Game Object being rendered in this call.
 * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 * @param {number} renderStep - The index of this function in the Game Object's list of render processes. Used to support multiple rendering functions.
 * @param {Phaser.GameObjects.GameObject[]} displayList - The display list which is currently being rendered.
 * @param {number} displayListIndex - The index of the Game Object within the display list.
 */
var StencilReferenceWebGLRenderer = function (renderer, src, drawingContext, parentMatrix, renderStep, displayList, displayListIndex)
{
    var stencil = src.targetStencil;

    // Cache the stencil options.
    var stencilAlphaStrategy = stencil.stencilAlphaStrategy;
    var stencilClearValue = stencil.stencilClearValue;
    var stencilCompositeCheck = stencil.stencilCompositeCheck;
    var stencilInvert = stencil.stencilInvert;
    var stencilLayerMode = stencil.stencilLayerMode;
    var stencilValueWrap = stencil.stencilValueWrap;

    // Edit the stencil properties.
    stencil.stencilAlphaStrategy = src.stencilAlphaStrategy;
    stencil.stencilClearValue = src.stencilClearValue;
    stencil.stencilCompositeCheck = src.stencilCompositeCheck;
    stencil.stencilInvert = src.stencilInvert;
    stencil.stencilLayerMode = src.stencilLayerMode;
    stencil.stencilValueWrap = src.stencilValueWrap;

    // Get the parent transform of the Stencil, not the StencilReference.
    var parentTransform = null;
    if (stencil.parentContainer)
    {
        parentTransform = stencil.parentContainer.getWorldTransformMatrix();
    }

    // Render the stencil.
    stencil.renderWebGLStep(renderer, stencil, drawingContext, parentTransform, 0);

    // Restore the stencil options.
    stencil.stencilAlphaStrategy = stencilAlphaStrategy;
    stencil.stencilClearValue = stencilClearValue;
    stencil.stencilCompositeCheck = stencilCompositeCheck;
    stencil.stencilInvert = stencilInvert;
    stencil.stencilLayerMode = stencilLayerMode;
    stencil.stencilValueWrap = stencilValueWrap;
};

module.exports = StencilReferenceWebGLRenderer;
