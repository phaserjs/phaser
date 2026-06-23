/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var StencilModifier = require('../components/StencilModifier');
var Container = require('../container/Container');
var Layer = require('../layer/Layer');

/**
 * @classdesc
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
 * By default, most Phaser shaders support alpha strategies.
 * Notable exceptions include:
 *
 * - PointLight (additive lighting)
 * - Shader game objects, and extended classes like Noise
 *
 * To apply an alpha strategy without a compatible shader,
 * force stencil composition by setting `stencilCompositeCheck` to `true`.
 * This will composite the stencil contents to a framebuffer,
 * which is rendered using a compatible shader.
 *
 * Stencils are drawn as order-independent layers.
 * You can add or remove layers in sequence using `addLayer` and `removeLayer`.
 * Each layer adds or subtracts 1 from the stencil buffer.
 * Only when the stencil is 0 at a pixel will anything be drawn there.
 * (This 0-test is a rule set by the renderer's base DrawingContext.)
 * Note that overlapping geometry within the same Stencil is additive,
 * and can adjust the layer by more than 1 in aggregate.
 * The results can be surprising, so try to avoid overlaps.
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
 * You can remove the stencil by using {@link Phaser.GameObjects.StencilReference}.
 * This object copies a target Stencil, and re-renders it
 * with different stencil options, elsewhere in the display list.
 * This is an efficient way to re-use stencil geometry.
 *
 * You can also clear the stencil by setting `stencilLayerMode` to `clear`.
 * It replaces all stencil buffer values with the `stencilClearValue`.
 * This should normally set them back to 0 so everything renders again.
 * This destroys all layer information.
 * It does not use the child list.
 * Be careful not to mess up your scene this way.
 *
 * Set `stencilLayerMode` to `clearRegion` to fill a region
 * of the stencil buffer defined by the children, with the `stencilClearValue`.
 * This can be used as a selective eraser, or to set a region to a specific value.
 *
 * You cannot invert the stencil if the `stencilLayerMode` is `clear` or `clearRegion`.
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
 * Deactivate `stencilValueWrap` to prevent the stencil buffer from wrapping.
 * This is useful when defining stencils with subtraction,
 * and you don't want to underflow from 0 to 255.
 * For example, you can use one stencil in `clearRegion` to define a value,
 * then use another stencil in `subtractLayer` to erase parts of that region.
 * But be careful when using stencils for different purposes:
 * if you mix stencil data, you will get unexpected results.
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
 * @extends Phaser.GameObjects.Components.StencilModifier
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 4.2.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {Phaser.GameObjects.GameObject[]} [children] - An optional array of Game Objects to add to the Stencil.
 * @param {Phaser.Types.GameObjects.Stencil.StencilOptions} [options] - The options for the Stencil.
 */
var Stencil = new Class({
    Extends: Container,

    Mixins: [
        StencilModifier
    ],

    initialize: function Stencil (scene, x, y, children, options) {
        Container.call(this, scene, x, y, children);

        if (options)
        {
            if (options.stencilAlphaStrategy !== undefined)
            {
                this.stencilAlphaStrategy = options.stencilAlphaStrategy;
            }
            else
            {
                this.stencilAlphaStrategy = scene.renderer.config.stencilAlphaStrategy;
            }
            if (options.stencilClearValue !== undefined)
            {
                this.stencilClearValue = options.stencilClearValue;
            }
            if (options.stencilCompositeCheck !== undefined)
            {
                this.stencilCompositeCheck = options.stencilCompositeCheck;
            }
            if (options.stencilInvert !== undefined)
            {
                this.stencilInvert = options.stencilInvert;
            }
            if (options.stencilLayerMode !== undefined)
            {
                this.stencilLayerMode = options.stencilLayerMode;
            }
            if (options.stencilValueWrap !== undefined)
            {
                this.stencilValueWrap = options.stencilValueWrap;
            }
        }
        else
        {
            this.stencilAlphaStrategy = scene.renderer.config.stencilAlphaStrategy;
        }

        // Add the stencil render step as the first render step.
        this.addRenderStep(this.stencilRenderStep, 0);
    },

    /**
     * The stencil render step.
     * This is an internal function, which is automatically assigned;
     * you should not call it directly.
     *
     * This runs before other render steps,
     * so it can set up the drawing context to render properly.
     * It delegates to the appropriate render step function based on the `stencilLayerMode`.
     *
     * @method Phaser.GameObjects.Stencil#stencilRenderStep
     * @webglOnly
     * @since 4.2.0
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
        switch (gameObject.stencilLayerMode)
        {
            case 'clear':
            {
                gameObject.stencilRenderStepClear(renderer, gameObject, drawingContext, parentMatrix, renderStep, displayList, displayListIndex);
                break;
            }
            case 'clearRegion':
            {
                gameObject.stencilRenderStepClearRegion(renderer, gameObject, drawingContext, parentMatrix, renderStep, displayList, displayListIndex);
                break;
            }
            case 'addLayer':
            case 'subtractLayer':
            default:
            {
                gameObject.stencilRenderStepLayers(renderer, gameObject, drawingContext, parentMatrix, renderStep, displayList, displayListIndex);
                break;
            }
        }
    },

    /**
     * The render step used when the `stencilLayerMode` is `addLayer` or `subtractLayer`.
     * You should not call this directly.
     *
     * @method Phaser.GameObjects.Stencil#stencilRenderStepLayers
     * @webglOnly
     * @since 4.2.0
     * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object being rendered in this call.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - This transform matrix is defined if the game object is nested
     * @param {number} [renderStep=0] - The index of this function in the Game Object's list of render processes. Used to support multiple rendering functions.
     * @param {Phaser.GameObjects.GameObject[]} [displayList] - The display list which is currently being rendered.
     * @param {number} [displayListIndex] - The index of the Game Object within the display list.
     */
    stencilRenderStepLayers: function (renderer, gameObject, drawingContext, parentMatrix, renderStep, displayList, displayListIndex)
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
        currentContext.setColorWritemask(false, false, false, false);
        var opIncr = gameObject.stencilValueWrap ? gl.INCR_WRAP : gl.INCR;
        var opDecr = gameObject.stencilValueWrap ? gl.DECR_WRAP : gl.DECR;
        var op = opIncr;
        if (gameObject.stencilLayerMode === 'subtractLayer')
        {
            op = opDecr;
        }
        currentContext.setStencil(true, gl.ALWAYS, 0, 0xFF, op, op, op, 0, 0xFF);

        currentContext.use();

        // Invert the stencil area if needed.
        if (gameObject.stencilInvert)
        {
            renderer.renderNodes.getNode('FillCamera').run(currentContext, 0xff000000, drawingContext.useCanvas);

            currentContext = currentContext.getClone();
            currentContext.use();

            // Invert the stencil operation.
            op = op === opIncr ? opDecr : opIncr;
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
     * The render step used when the `stencilLayerMode` is `clear`.
     * You should not call this directly.
     *
     * @method Phaser.GameObjects.Stencil#stencilRenderStepClear
     * @webglOnly
     * @since 4.2.0
     * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object being rendered in this call.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - This transform matrix is defined if the game object is nested
     * @param {number} [renderStep=0] - The index of this function in the Game Object's list of render processes. Used to support multiple rendering functions.
     * @param {Phaser.GameObjects.GameObject[]} [displayList] - The display list which is currently being rendered.
     * @param {number} [displayListIndex] - The index of the Game Object within the display list.
     */
    stencilRenderStepClear: function (renderer, gameObject, drawingContext, parentMatrix, renderStep, displayList, displayListIndex)
    {
        var gl = renderer.gl;

        var currentContext = drawingContext.getClone();
        currentContext.state.stencil.clear = gameObject.stencilClearValue;
        currentContext.state.stencil.writeMask = 0xFF;
        currentContext.use();
        currentContext.clear(gl.STENCIL_BUFFER_BIT);
    },

    /**
     * The render step used when the `stencilLayerMode` is `clearRegion`.
     * You should not call this directly.
     *
     * @method Phaser.GameObjects.Stencil#stencilRenderStepClearRegion
     * @webglOnly
     * @since 4.2.0
     * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object being rendered in this call.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - This transform matrix is defined if the game object is nested
     * @param {number} [renderStep=0] - The index of this function in the Game Object's list of render processes. Used to support multiple rendering functions.
     * @param {Phaser.GameObjects.GameObject[]} [displayList] - The display list which is currently being rendered.
     * @param {number} [displayListIndex] - The index of the Game Object within the display list.
     */
    stencilRenderStepClearRegion: function (renderer, gameObject, drawingContext, parentMatrix, renderStep, displayList, displayListIndex)
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
        currentContext.setColorWritemask(false, false, false, false);
        var clearValue = gameObject.stencilClearValue;
        var op = gl.REPLACE;
        currentContext.setStencil(true, gl.ALWAYS, clearValue, 0xFF, op, op, op, clearValue, 0xFF);

        currentContext.use();

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
     * @since 4.2.0
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
