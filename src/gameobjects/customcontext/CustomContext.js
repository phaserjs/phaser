/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Container = require('../container/Container');

/**
 * @classdesc
 * The Custom Context is a game object that allows you to modify the drawing context before it is used.
 *
 * The Custom Context is an extended Container Game Object.
 * Before game objects are rendered,
 * it clones the current DrawingContext and passes it to a callback.
 * You can configure this callback to set options on the DrawingContext.
 *
 * See the {@link Phaser.Renderer.WebGL.DrawingContext} documentation for more details
 * on DrawingContext settings.
 * This is an advanced rendering system and should be used carefully.
 * You should mostly only use the setter methods on the DrawingContext object.
 * Methods that don't begin with `set` are typically for internal use.
 *
 * If you modify the DrawingContext to create a new framebuffer,
 * it will not render to the canvas.
 * It is your responsibility to use the texture from the DrawingContext.
 * It is very inefficient to create a new framebuffer every frame,
 * though, so you should use a `DynamicTexture` with a retained framebuffer instead.
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
 * @param {Phaser.Types.GameObjects.CustomContext.CustomContextCallback} [customContextCallback] - A function to be called before the custom DrawingContext is activated. If undefined, no callback will be called.
 */
var CustomContext = new Class({
    Extends: Container,

    initialize: function CustomContext(scene, x, y, children, customContextCallback) {
        Container.call(this, scene, x, y, children);

        /**
         * A function to be called before the custom DrawingContext is activated.
         * Set this function to modify the drawing context before it is used,
         * or set it to `null` to leave it as is.
         * If defined, the callback runs during the `customContextRenderStep` method.
         *
         * The callback is called with one parameter:
         * a copy of the current drawing context.
         *
         * @example
         * // Copy the source context and disable the stencil test.
         * this.customContextCallback = (drawingContext) => {
         *     drawingContext.state.stencil.enabled = false;
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
     * @param {number} [renderStep] - The index of this function in the Game Object's list of render processes. Used to support multiple rendering functions.
     * @param {Phaser.GameObjects.GameObject[]} [displayList] - The display list which is currently being rendered.
     * @param {number} [displayListIndex] - The index of the Game Object within the display list.
     */
    customContextRenderStep: function (renderer, gameObject, drawingContext, parentMatrix, renderStep, displayList, displayListIndex)
    {
        if (renderStep === undefined) { renderStep = 0; }

        if (!gameObject.customContextCallback)
        {
            gameObject.renderWebGLStep(
                renderer,
                gameObject,
                drawingContext,
                parentMatrix,
                renderStep + 1,
                displayList,
                displayListIndex
            );
            return;
        }

        var currentContext = drawingContext.getClone();
        gameObject.customContextCallback(currentContext);
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
