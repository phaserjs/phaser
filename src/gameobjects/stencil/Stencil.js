/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Container = require('../container/Container');
const Layer = require('../layer/Layer');

/**
 * A Stencil Game Object.
 *
 * A Stencil is a special type of Game Object used to place stencils over the canvas.
 * You can use it to efficiently control where subsequent objects are rendered.
 * It is WebGL-only.
 * Study the documentation carefully to understand how it works.
 *
 * A Stencil is an extended Container Game Object.
 * It contains a list of child Game Objects to render to the stencil buffer.
 * Think of these as opaque sheets of card held up over the canvas,
 * preventing anything from being drawn through them.
 *
 * The stencil buffer is provided by WebGL.
 * It is available if the game render config set `stencil` to `true`.
 * It is an 8-bit attachment to framebuffers, like an extra alpha channel.
 * But if the stencil channel is not 0 at a pixel, WebGL will skip rendering that pixel.
 * There are no degrees of transparency, only on or off.
 *
 * When you draw objects with alpha to a Stencil,
 * a special `alphaStrategy` is used. Compatible shaders switch from rendering
 * alpha, to discarding fragments based on their alpha value.
 * By default, this uses dithering to preserve alpha gradients.
 * You can change `stencilAlphaStrategy` to a threshold value to instead
 * discard without dithering.
 * If `stencilAlphaStrategy` is `'keep'`,
 * or the child's shader does not support alpha strategies,
 * transparent pixels will be drawn as opaque to the stencil buffer!
 * This is rarely what you want.
 * Fragment shaders must `discard` fragments for them to be transparent to the stencil buffer.
 *
 * Stencils are drawn as order-independent layers.
 * You can add or remove layers in sequence using `addLayer` and `removeLayer`.
 * Each layers adds or subtracts 1 from the stencil buffer.
 * Only when the stencil is 0 at a pixel will anything be drawn there.
 *
 * You can invert the stencil by setting `stencilInvert` to `true`.
 * This will use an extra draw call to invert the stencil:
 * it adds a layer everywhere that the children would not draw.
 * It is more efficient to render a shape that covers the whole area you wish to stencil,
 * but if that's not possible, you can use this.
 * Inversion makes it possible to render to parts of the screen not touched
 * by child geometry.
 * It works by filling the camera, then drawing the child stencil in reverse.
 *
 * Sequential stencil layers combine and persist,
 * because they are drawn to the stencil buffer and stay there until the next frame.
 * Do not add too many layers, though. There are only 8 bits in the stencil buffer,
 * so it only safely supports 255 layers.
 * If you go over this limit, the buffer wraps back to 0.
 * You can still add and remove layers in this case,
 * and they will continue to be accurately tracked,
 * but layer 256 (and subsequent multiples of 256) will be effectively 0 and allow drawing.
 * The same applies if you remove layers below 0: it wraps back to 255
 * and prevents drawing.
 *
 * Nested stencils are a separate concern.
 * If you add a Stencil as the child of another Stencil,
 * the parent Stencil will composite its contents to a framebuffer,
 * including child stencils.
 * This effectively traps the child stencil in the framebuffer,
 * and only the final composite from the framebuffer needs to be considered.
 * It is used as the source for the stencil, subject to alpha strategy.
 * This requires extra draw calls to composite,
 * and framebuffers have poor anti-aliasing quality,
 * so you should avoid nesting stencils unless you know what you are doing.
 *
 * To determine whether the stencil needs to composite to a framebuffer,
 * it runs a check before rendering (`'auto'` mode).
 * If you know the answer already,
 * or if you have a custom game object that Phaser doesn't understand,
 * you can set `stencilCompositeCheck` to `true` or `false`
 * to skip the auto check.
 * If you set it to `false`, it will never composite,
 * and any child stencils may render in unexpected ways.
 * (Generally, they will appear backwards from what you expect:
 * child stencils will not affect the parent stencil, but things drawn later.)
 *
 * Best practice: use few stencils and don't nest them.
 *
 * Stencil is best used for efficient, sharp-edged, reused masks.
 * You can draw a stencil once, and it will affect everything that is drawn later.
 * Its rendering cost is minimal: it is just the draw cost of its children.
 * This can be as low as 1 call.
 * If there are nested stencils, it will take more calls for the framebuffer.
 *
 * If you need better quality alpha handling, consider using a Mask filter instead.
 * Filters have a higher rendering cost, and apply to just 1 object at a time,
 * but they have the best quality.
 * (And you can apply them to Containers, to cheat the object limitation.)
 *
 * @class Stencil
 * @extends Phaser.GameObjects.Container
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 4.NEXT
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {Phaser.GameObjects.GameObject[]} [children] - An optional array of Game Objects to add to the Stencil.
 * @param {Phaser.Types.GameObjects.Stencil.StencilOptions} [options] - The options for the Stencil.
 */
var Stencil = new Class({
    Extends: Container,

    initialize: function Stencil (scene, x, y, children, options) {
        Container.call(this, scene, x, y, children);

        var options = options || {};
        var stencilAlphaStrategy = options.stencilAlphaStrategy;
        var stencilCompositeCheck = options.stencilCompositeCheck;
        var stencilInvert = options.stencilInvert || false;
        var stencilLayerMode = options.stencilLayerMode || 'addLayer';
        if (stencilAlphaStrategy === undefined)
        {
            stencilAlphaStrategy = scene.renderer.config.stencilAlphaStrategy;
        }
        if (stencilCompositeCheck === undefined)
        {
            stencilCompositeCheck = 'auto';
        }

        /**
         * The mode to use when rendering the stencil.
         *
         * - 'addLayer' - Add a stencil layer.
         * - 'subtractLayer' - Subtract a stencil layer.
         *
         * @name Phaser.GameObjects.Stencil#stencilLayerMode
         * @type {'addLayer'|'subtractLayer'}
         * @default 'addLayer'
         * @since 4.NEXT
         */
        this.stencilLayerMode = stencilLayerMode;

        /**
         * Whether to invert the stencil, using an extra draw call.
         *
         * @name Phaser.GameObjects.Stencil#stencilInvert
         * @type {boolean}
         * @default false
         * @since 4.NEXT
         */
        this.stencilInvert = stencilInvert;

        /**
         * The alpha strategy to use when rendering the stencil.
         * This is usually set to `dither`, or the default game config setting.
         *
         * @name Phaser.GameObjects.Stencil#stencilAlphaStrategy
         * @type {Phaser.Types.Renderer.WebGL.AlphaStrategy}
         * @since 4.NEXT
         */
        this.stencilAlphaStrategy = stencilAlphaStrategy;

        /**
         * Whether to composite the contents of the stencil to a framebuffer.
         * This is necessary when the stencil contains stencils.
         * It requires extra draw calls to composite.
         * You should set this to `false` or `true` if you know the answer,
         * or `auto` to have Phaser automatically determine the best option.
         *
         * This will set `filtersForceComposite` to `true` during rendering.
         *
         * @name Phaser.GameObjects.Stencil#stencilCompositeCheck
         * @type {boolean|'auto'}
         * @default 'auto'
         * @since 4.NEXT
         */
        this.stencilCompositeCheck = stencilCompositeCheck;

        // Add the stencil render step as the first render step.
        this.addRenderStep(this.stencilRenderStep, 0);
    },

    /**
     * Whether this Game Object is a stencil modifier.
     * Do not edit this property. It is used internally.
     *
     * Any object with `isStencilModifier` set to `true` is a positive result
     * for `hasStencilChildren`, and can affect stencil compositing.
     *
     * @name Phaser.GameObjects.Stencil#isStencilModifier
     * @type {boolean}
     * @since 4.NEXT
     * @default true
     * @readonly
     */
    isStencilModifier: true,

    /**
     * Sets the alpha strategy to use when rendering the stencil.
     *
     * @method Phaser.GameObjects.Stencil#setStencilAlphaStrategy
     * @since 4.NEXT
     * @param {Phaser.Types.Renderer.WebGL.AlphaStrategy} stencilAlphaStrategy - The alpha strategy to use when rendering the stencil.
     * @returns {this} This Game Object instance.
     */
    setStencilAlphaStrategy: function (stencilAlphaStrategy)
    {
        this.stencilAlphaStrategy = stencilAlphaStrategy;
        return this;
    },

    /**
     * Sets whether to composite the contents of the stencil to a framebuffer.
     * While `auto` is default, it must run extra checks,
     * so you should set it to `true` or `false` if you know the answer.
     *
     * - `true` - Composite the contents of the stencil to a framebuffer.
     * - `false` - Do not composite the contents of the stencil to a framebuffer.
     * - `'auto'` - Automatically determine whether to composite the contents of the stencil to a framebuffer.
     *
     * @method Phaser.GameObjects.Stencil#setStencilCompositeCheck
     * @since 4.NEXT
     * @param {boolean|'auto'} stencilCompositeCheck - The check mode to use.
     * @returns {this} This Game Object instance.
     */
    setStencilCompositeCheck: function (stencilCompositeCheck)
    {
        this.stencilCompositeCheck = stencilCompositeCheck;
        return this;
    },

    /**
     * Sets whether to invert the stencil, using an extra draw call.
     *
     * @method Phaser.GameObjects.Stencil#setStencilInvert
     * @since 4.NEXT
     * @param {boolean} stencilInvert - Whether to invert the stencil.
     * @returns {this} This Game Object instance.
     */
    setStencilInvert: function (stencilInvert)
    {
        this.stencilInvert = stencilInvert;
        return this;
    },

    /**
     * Sets the mode to use when rendering the stencil.
     *
     * - 'addLayer' - Add a stencil layer.
     * - 'subtractLayer' - Subtract a stencil layer.
     *
     * @method Phaser.GameObjects.Stencil#setStencilLayerMode
     * @since 4.NEXT
     * @param {Phaser.Types.GameObjects.Stencil.StencilLayerMode} stencilLayerMode - The mode which the Stencil should run in.
     * @returns {this} This Game Object instance.
     */
    setStencilLayerMode: function (stencilLayerMode)
    {
        this.stencilLayerMode = stencilLayerMode;
        return this;
    },

    /**
     * The stencil render step.
     * This runs before other render steps,
     * so it can set up the drawing context to render to the stencil buffer.
     * It also activates forced composite mode if the stencil contains stencils.
     *
     * @method Phaser.GameObjects.Stencil#stencilRenderStep
     * @webglOnly
     * @since 4.NEXT
     * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object being rendered in this call.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - This transform matrix is defined if the game object is nested
     * @param {number} [renderStep=0] - The index of this function in the Game Object's list of render processes. Used to support multiple rendering functions.
     * @param {Phaser.GameObjects.GameObject[]} [displayList] - The display list which is currently being rendered.
     * @param {number} [displayListIndex] - The index of the Game Object within the display list.
     */
    stencilRenderStep: function (renderer, gameObject, drawingContext, parentMatrix, renderStep, displayList, displayListIndex)
    {
        var gl = renderer.gl;

        // If the tree of child game objects has any stencil children,
        // activate forced composite mode on `gameObject`.
        var filtersForceComposite = gameObject.filtersForceComposite;
        if (
            gameObject.stencilCompositeCheck === true ||
            (gameObject.stencilCompositeCheck === 'auto' && gameObject.hasStencilChildren(gameObject, drawingContext.camera))
        )
        {
            gameObject.enableFilters().setFiltersForceComposite(true);
        }

        // Set up the drawing context to render to the stencil buffer.
        var currentContext = drawingContext.getClone();
        currentContext.setAlphaStrategy(gameObject.stencilAlphaStrategy);
        currentContext.stencilDepth++;
        currentContext.setColorWritemask(false, false, false, false);
        var op = gl.INCR_WRAP;
        if (gameObject.stencilLayerMode === 'subtractLayer')
        {
            op = gl.DECR_WRAP;
        }
        currentContext.setStencil(true, gl.ALWAYS, 0, 0xFF, op, op, op, 0, 0xFF);

        currentContext.use();

        // Invert the stencil area if needed.
        if (gameObject.stencilInvert)
        {
            renderer.renderNodes.getNode('FillCamera').run(currentContext, 0x000000, drawingContext.useCanvas);

            currentContext = currentContext.getClone();
            currentContext.use();

            // Invert the stencil operation.
            op = op === gl.INCR_WRAP ? gl.DECR_WRAP : gl.INCR_WRAP;
            currentContext.setStencil(true, gl.ALWAYS, 0, 0xFF, op, op, op, 0, 0xFF);
        }

        // Render the children.
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

        gameObject.setFiltersForceComposite(filtersForceComposite);
    },

    /**
     * Checks if the game object or any of its children has a stencil.
     * This is used internally to determine if the stencil should composite its contents to a framebuffer.
     *
     * This is a depth-first, succeed-fast search.
     *
     * @method Phaser.GameObjects.Stencil#hasStencilChildren
     * @since 4.NEXT
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object to check.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera to check.
     * @returns {boolean} Whether the game object or any of its children has a stencil.
     */
    hasStencilChildren: function (gameObject, camera)
    {
        if (gameObject instanceof Container || gameObject instanceof Layer)
        {
            for (var i = 0; i < gameObject.list.length; i++)
            {
                var child = gameObject.list[i];
                if (
                    child &&
                    child.willRender(camera) &&
                    (
                        child.isStencilModifier ||
                        this.hasStencilChildren(child, camera)
                    )
                )
                {
                    return true;
                }
            }
        }
        return false;
    }
});

module.exports = Stencil;
