/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Container = require('../container/Container');
var DrawingContext = require('../../renderer/webgl/DrawingContext');

/**
 * @classdesc
 * The Custom Context is a game object that allows you to modify the drawing context before it is used.
 *
 * The Custom Context is an extended Container Game Object.
 * It contains a custom DrawingContext which is used to render the game objects.
 * Typical usage scenarios include:
 * - Defining a different context.
 * - Modifying the context before it is used.
 *
 * See the {@link Phaser.Renderer.WebGL.DrawingContext} documentation for more details
 * on DrawingContext settings.
 * This is an advanced rendering system and should be used carefully.
 * You should mostly only use the setter methods on the DrawingContext object.
 * Methods that don't begin with `set` are typically for internal use.
 *
 * @class CustomContext
 * @extends Phaser.GameObjects.Container
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 4.NEXT
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {Phaser.GameObjects.GameObject[]} [children] - An optional array of Game Objects to add to the Custom Context.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.DrawingContextOptions} [options] - The options for the custom DrawingContext. If undefined, the custom DrawingContext will be a copy of the base DrawingContext.
 * @param {Phaser.Types.GameObjects.CustomContext.CustomContextCallback} [customContextCallback] - A function to be called before the custom DrawingContext is activated. If undefined, no callback will be called.
 */
var CustomContext = new Class({
    Extends: Container,

    initialize: function CustomContext(scene, x, y, children, options, customContextCallback) {
        Container.call(this, scene, x, y, children);

        /**
         * The drawing context of this Custom Context.
         *
         * @name Phaser.GameObjects.CustomContext#drawingContext
         * @type {Phaser.Renderer.WebGL.DrawingContext}
         * @since 4.NEXT
         */
        this.drawingContext = new DrawingContext(scene.renderer, options);

        if (!options)
        {
            this.drawingContext.copy(scene.renderer.baseDrawingContext);
            this.drawingContext.setAutoClear(false, false, false);
        }

        /**
         * A function to be called before the custom DrawingContext is activated.
         * Set this function to modify the drawing context before it is used,
         * or set it to `null` to leave it as is.
         * If defined, the callback runs during the `customContextRenderStep` method.
         * Note that `this.drawingContext` copies the current camera before
         * the callback is called.
         *
         * The callback is called with the following parameters:
         * - `sourceContext`: The drawing context received from the render system. Use this as a reference for the current rendering state.
         * - `customContext`: The drawing context which will be passed on for rendering. This is `this.drawingContext`.
         *
         * @example
         * // Copy the source context and disable the stencil test.
         * this.customContextCallback = (sourceContext, customContext) => {
         *     customContext.copy(sourceContext);
         *     customContext.state.stencil.enabled = false;
         * };
         *
         * @name Phaser.GameObjects.CustomContext#customContextCallback
         * @type {Phaser.Types.GameObjects.CustomContext.CustomContextCallback | null}
         * @since 4.NEXT
         */
        this.customContextCallback = customContextCallback || null;

        this.addRenderStep(this.customContextRenderStep, 0);
    },

    /**
     * The custom render step for the Custom Context.
     * This runs before rendering the game object,
     * allowing you to modify the drawing context before it is used.
     *
     * @method Phaser.GameObjects.CustomContext#customContextRenderStep
     * @since 4.NEXT
     * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object being rendered in this call.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - This transform matrix is defined if the game object is nested
     * @param {number} [renderStep=0] - The index of this function in the Game Object's list of render processes. Used to support multiple rendering functions.
     * @param {Phaser.GameObjects.GameObject[]} [displayList] - The display list which is currently being rendered.
     * @param {number} [displayListIndex] - The index of the Game Object within the display list.
     */
    customContextRenderStep: function (renderer, gameObject, drawingContext, parentMatrix, renderStep, displayList, displayListIndex)
    {
        var currentContext = gameObject.drawingContext;
        currentContext.camera = drawingContext.camera;

        if (gameObject.customContextCallback)
        {
            gameObject.customContextCallback(drawingContext, currentContext);
        }

        currentContext.use();

        gameObject.renderWebGLStep(
            renderer,
            gameObject,
            currentContext,
            parentMatrix,
            renderStep + 1,
            displayList,
            displayListIndex
        );

        currentContext.release();
    }
});

module.exports = CustomContext;
