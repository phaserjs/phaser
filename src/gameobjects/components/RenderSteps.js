/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Handles render steps for a Game Object.
 * The render step is a point in the render process that allows you to inject your own logic.
 *
 * @namespace Phaser.GameObjects.Components.RenderSteps
 * @webglOnly
 * @since 4.0.0
 */
var RenderSteps = {};

if (typeof WEBGL_RENDERER)
{
    RenderSteps = {
        /**
         * The list of steps to run when this Game Object is rendered.
         * This is used by `renderWebGLStep` to kick off rendering.
         * The functions in this list are responsible for invoking any
         * subsequent functions.
         *
         * @name Phaser.GameObjects.Components.RenderSteps#_renderSteps
         * @private
         * @webglOnly
         * @since 4.0.0
         * @type {Phaser.Types.GameObjects.RenderWebGLStep[]}
         */
        _renderSteps: null,

        /**
         * Run a step in the render process.
         * This is called automatically by the Render module.
         *
         * In most cases, it just runs the `renderWebGL` function.
         *
         * When `_renderSteps` has more than one entry,
         * such as when Filters are enabled for this object,
         * it allows those processes to defer `renderWebGL`
         * and otherwise manage the flow of rendering.
         *
         * @method Phaser.GameObjects.Components.RenderSteps#renderWebGLStep
         * @webglOnly
         * @since 4.0.0
         * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGL Renderer instance to render with.
         * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object being rendered.
         * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
         * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - The parent matrix of the Game Object, if it has one.
         * @param {number} [renderStep=0] - Which step of the rendering process should be run?
         * @param {Phaser.GameObjects.GameObject[]} [displayList] - The display list which is currently being rendered. If not provided, it will be created with the Game Object.
         * @param {number} [displayListIndex=0] - The index of the Game Object within the display list.
         */
        renderWebGLStep: function (
            renderer,
            gameObject,
            drawingContext,
            parentMatrix,
            renderStep,
            displayList,
            displayListIndex
        )
        {
            if (renderStep === undefined)
            {
                renderStep = 0;
            }

            var fn = gameObject._renderSteps[renderStep];

            if (!fn)
            {
                return;
            }

            if (!displayList)
            {
                displayList = [ gameObject ];
                displayListIndex = 0;
            }
            else if (displayListIndex === undefined)
            {
                displayListIndex = 0;
            }

            fn(renderer, gameObject, drawingContext, parentMatrix, renderStep, displayList, displayListIndex);
        },

        /**
         * Add a render step.
         *
         * The first render step in `_renderSteps` is run first.
         * It should call the next render step in the list.
         * This allows render steps to control the rendering flow.
         *
         * @method Phaser.GameObjects.Components.RenderSteps#addRenderStep
         * @param {Phaser.Types.GameObjects.RenderWebGLStep} fn - The render step function to add.
         * @param {number} [index] - The index in the render list to add the step to. Omit to add to the end.
         * 
         * @return {this} This Game Object instance.
         */
        addRenderStep: function (fn, index)
        {
            if (!this._renderSteps)
            {
                this._renderSteps = [];
            }

            if (index === undefined)
            {
                this._renderSteps.push(fn);
                return this;
            }

            this._renderSteps.splice(index, 0, fn);

            return this;
        }
    };
}

module.exports = RenderSteps;
