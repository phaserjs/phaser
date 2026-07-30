/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var ExternRender = require('./ExternRender');

/**
 * @classdesc
 * An Extern Game Object is a special type of Game Object that allows you to pass
 * rendering off to a 3rd party.
 *
 * When you create an Extern and place it in the display list of a Scene, the renderer will
 * process the list as usual. When it finds an Extern it will flush the current batch
 * and prepare a transform matrix which your render function can
 * take advantage of, if required.
 *
 * The WebGL context is then left in a 'clean' state, ready for you to bind your own shaders,
 * or draw to it, whatever you wish to do. This should all take place in the `render` method.
 * The correct way to deploy an Extern object is to create a class that extends it, then
 * override the `render` (and optionally `preUpdate`) methods and pass off control to your
 * 3rd party libraries or custom WebGL code there.
 *
 * The `render` method is called with this signature:
 * `render(renderer: Phaser.Renderer.WebGL.WebGLRenderer, drawingContext: Phaser.Renderer.WebGL.DrawingContext, calcMatrix: Phaser.GameObjects.Components.TransformMatrix, displayList: Phaser.GameObjects.GameObject[], displayListIndex: number): void`.
 *
 * The `displayList` and `displayListIndex` parameters allow you to check
 * other objects in the display list. This might be convenient for optimizing
 * operations such as resource management.
 *
 * Once you've finished, you should free-up any of your resources.
 * The Extern will then return Phaser state and carry on rendering the display list.
 *
 * Although this object has lots of properties such as Alpha, Blend Mode and Tint, none of
 * them are used during rendering unless you take advantage of them in your own render code.
 *
 * @example
 * extern.render = (webGLRenderer, drawingContext, calcMatrix) => {
 *         // You may want to initialize the external renderer here.
 *         // ...
 * 
 *         // Ensure the DrawingContext framebuffer is bound.
 *         // This allows you to use Filters on the external render.
 *         webGLRenderer.glWrapper.updateBindingsFramebuffer({
 *             bindings: {
 *                 framebuffer: drawingContext.framebuffer
 *             }
 *         }, true);
 * 
 *         // Run the external render method.
 *         // ...
 *     };
 *
 * @class Extern
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.16.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Size
 * @extends Phaser.GameObjects.Components.Texture
 * @extends Phaser.GameObjects.Components.Tint
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 */
var Extern = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Depth,
        Components.Flip,
        Components.Origin,
        Components.ScrollFactor,
        Components.Size,
        Components.Texture,
        Components.Tint,
        Components.Transform,
        Components.Visible,
        ExternRender
    ],

    initialize:

    function Extern (scene)
    {
        GameObject.call(this, scene, 'Extern');
    },

    /**
     * Called when this Extern is added to a Scene.
     *
     * Registers the Extern with the Scene's Update List so that `preUpdate` is called each frame.
     *
     * @method Phaser.GameObjects.Extern#addedToScene
     * @since 3.50.0
     */
    addedToScene: function ()
    {
        this.scene.sys.updateList.add(this);
    },

    /**
     * Called when this Extern is removed from a Scene.
     *
     * Removes the Extern from the Scene's Update List so that `preUpdate` is no longer called.
     *
     * @method Phaser.GameObjects.Extern#removedFromScene
     * @since 3.50.0
     */
    removedFromScene: function ()
    {
        this.scene.sys.updateList.remove(this);
    },

    /**
     * Called automatically by the Scene Update List each frame.
     *
     * Override this method in your own class to add custom logic that
     * should run every frame, such as updating animations or physics.
     *
     * @method Phaser.GameObjects.Extern#preUpdate
     * @since 3.16.0
     *
     * @param {number} time - The current timestamp, as generated by the Request Animation Frame or SetTimeout.
     * @param {number} delta - The delta time, in ms, elapsed since the last frame.
     */
    preUpdate: function ()
    {
        //  override this!
        //  Arguments: time, delta
    },

    /**
     * Override this method in your own class to provide custom rendering logic.
     *
     * When the renderer encounters this Extern in the display list, it will flush the
     * current batch, prepare a transform matrix, and leave the WebGL context in a clean
     * state for you to bind your own shaders or draw calls.
     *
     * @method Phaser.GameObjects.Extern#render
     * @since 3.16.0
     *
     * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGL Renderer instance.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current Drawing Context.
     * @param {Phaser.GameObjects.Components.TransformMatrix} calcMatrix - The calculated Transform Matrix for this Extern.
     * @param {Phaser.GameObjects.GameObject[]} displayList - The current display list for the Scene.
     * @param {number} displayListIndex - The index of this Extern within the display list.
     */
    render: function ()
    {
        //  override this!
        //  Arguments: renderer, drawingContext, calcMatrix, displayList, displayListIndex
    }

});

module.exports = Extern;
