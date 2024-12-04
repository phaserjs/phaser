/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
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

if (typeof WEBGL_RENDERER) RenderSteps = {
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
     * and otherwise manage the flow of rendering
     *
     * The first time this method is called,
     * it will run initialization logic that adds `renderWebGL` to the end
     * of the `_renderSteps` array.
     * Then it will replace itself with `_renderWebGLStep`
     * and continue with the rendering process.
     *
     * @method Phaser.GameObjects.GameObject#renderWebGLStep
     * @webglOnly
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGL Renderer instance to render with.
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object being rendered.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - The parent matrix of the Game Object, if it has one.
     * @param {number} [renderStep=0] - Which step of the rendering process should be run?
     */
    renderWebGLStep: function (
        renderer,
        gameObject,
        drawingContext,
        parentMatrix,
        renderStep
    )
    {
        if (gameObject.renderWebGL)
        {
            gameObject.addRenderStep(gameObject.renderWebGL);
        }

        gameObject.renderWebGLStep = gameObject._renderWebGLStep;

        gameObject._renderWebGLStep(
            renderer,
            gameObject,
            drawingContext,
            parentMatrix,
            renderStep
        );
    },

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
     * This private method will be copied over `renderWebGLStep`
     * the first time it runs. You should not call this method directly.
     *
     * @method Phaser.GameObjects.GameObject#_renderWebGLStep
     * @private
     * @webglOnly
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGL Renderer instance to render with.
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object being rendered.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - The parent matrix of the Game Object, if it has one.
     * @param {number} [renderStep=0] - Which step of the rendering process should be run?
     */
    _renderWebGLStep: function (
        renderer,
        gameObject,
        drawingContext,
        parentMatrix,
        renderStep
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

        fn(renderer, gameObject, drawingContext, parentMatrix, renderStep);
    },

    addRenderStep: function (fn, index)
    {
        this.initRenderSteps();

        if (index === undefined)
        {
            this._renderSteps.push(fn);
            return;
        }

        this._renderSteps.splice(index, 0, fn);
    },

    initRenderSteps: function ()
    {
        if (!this._renderSteps)
        {
            this._renderSteps = [];
        }
    }
};

module.exports = RenderSteps;
