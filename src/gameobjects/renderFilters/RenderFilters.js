/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Camera = require('../../cameras/2d/Camera');
var Rectangle = require('../../geom/rectangle/Rectangle');
var BlendModes = require('../../renderer/BlendModes');
var DefaultRenderFiltersNodes = require('../../renderer/webgl/renderNodes/defaults/DefaultRenderFiltersNodes');
var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var RenderFiltersRender = require('./RenderFiltersRender');

/**
 * @classdesc
 * A RenderFilters Game Object. This wraps another GameObject and renders it to a texture.
 * The RenderFilters applies special effects, post-processing,
 * and masks to this texture.
 *
 * The RenderFilters works by rendering the child to a texture.
 * The texture is then rendered again for each filter, using a shader.
 * See {@link Phaser.GameObjects.Components.FilterList} for more information.
 *
 * Each RenderFilters, and each filter within it, makes a new draw call.
 * This can be expensive. Use sparingly.
 *
 * ---
 *
 * ## Camera
 *
 * The RenderFilters has a Camera property, which is used to render the child.
 * The Camera does most of the hard work, including the filters.
 *
 * The Camera is set to fit the child object,
 * so you should not adjust it directly.
 *
 * ---
 *
 * ## Framebuffer Coverage
 *
 * The RenderFilters renders to a framebuffer. This is a texture.
 * Anything outside the bounds of the framebuffer cannot be rendered.
 * Think of it as a window into another world.
 *
 * To ensure that the child fits into the framebuffer,
 * the internal camera is transformed to fit the child.
 * This means that the child's transforms appear to be zeroed,
 * but they are simply being compensated for.
 * The RenderFilters resizes to fit the child.
 *
 * The RenderFilters will continue to update coverage
 * if you activate the `autoFocus` property.
 * You can continue to move the child while autoFocus is on.
 * Its game position will not update unless you change the RenderFilters' position.
 * When disabled, you can use `focus` to adjust the view quickly,
 * or use`setSize`, `setOrigin`, and camera methods to adjust the view manually.
 *
 * ### Troubleshooting Example
 *
 * Say we have a game with a resolution of 800, 600,
 * containing a ParticleEmitter at 400, 200.
 * The ParticleEmitter releases particles that may fly off-screen.
 * We want to apply a filter to the ParticleEmitter.
 *
 * ```javascript
 * // Within a Scene
 * const renderFilters = this.add.renderFilters(emitter);
 * ```
 *
 * Problem: the bounds of the ParticleEmitter are initially 0, 0.
 * It changes size over time. The initial bounds which are set on creation
 * are too small.
 *
 * We could activate `autoFocus` to ensure that the ParticleEmitter
 * is always in view. This will update the RenderFilters every frame.
 *
 * ```javascript
 * renderFilters.autoFocus = true;
 * ```
 *
 * But beware: `autoFocus` will create new framebuffers as the particles move.
 * This can be expensive, and should be avoided if possible.
 * The framebuffers may grow to be larger than the screen,
 * and change every frame.
 *
 * Instead, we can manually focus the RenderFilters to the ParticleEmitter.
 *
 * ```javascript
 * renderFilters.focus(400, 200, 800, 600);
 * ```
 *
 * This will set the RenderFilters to view the ParticleEmitter at 400, 200,
 * with a width and height of 800, 600.
 * The RenderFilters will neatly fill the game screen, and no more.
 *
 * In general, dynamic objects require extra attention.
 * Objects without well-defined bounds such as Graphics and Rope
 * will require manual focus changes; `autoFocus` is not recommended.
 * Try the following generic example:
 *
 * ```javascript
 * renderFilters.focus(child.x, child.y, game.width, game.height);
 * ```
 *
 * Ordinary objects such as Sprites will rarely require a focus change.
 * Only when they are getting cut off is it necessary to adjust the view.
 *
 * @class RenderFilters
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 4.0.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.RenderNodes
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Size
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {Phaser.GameObjects.GameObject} child - The Game Object that this RenderFilters will wrap.
 */
var RenderFilters = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Depth,
        Components.Flip,
        Components.GetBounds,
        Components.Origin,
        Components.RenderNodes,
        Components.ScrollFactor,
        Components.Size,
        Components.Transform,
        Components.Visible,
        RenderFiltersRender
    ],

    initialize: function RenderFilters (scene, child)
    {
        GameObject.call(this, scene, 'RenderFilters');

        /**
         * The Game Object that this RenderFilters is wrapping.
         *
         * @name Phaser.GameObjects.RenderFilters#child
         * @type {?Phaser.GameObjects.GameObject}
         * @since 4.0.0
         */
        this.child = null;

        /**
         * The Camera used inside this RenderFilters.
         * You can use this to alter the perspective on the wrapped child.
         * It is not necessary for ordinary rendering.
         *
         * @name Phaser.GameObjects.RenderFilters#camera
         * @type {Phaser.Cameras.Scene2D.Camera}
         * @since 4.0.0
         */
        this.camera = new Camera(0, 0, 1, 1).setScene(scene, false);

        /**
         * The maximum width of the base RenderFilters texture.
         * Filters may use a larger texture after the base texture is rendered.
         * The maximum texture size is 4096 in WebGL.
         * You may set this lower to save memory or prevent resizing.
         *
         * @name Phaser.GameObjects.RenderFilters#maxWidth
         * @type {number}
         * @default 4096
         * @since 4.0.0
         */
        this.maxWidth = 4096;

        /**
         * The maximum height of the base RenderFilters texture.
         * Filters may use a larger texture after the base texture is rendered.
         * The maximum texture size is 4096 in WebGL.
         * You may set this lower to save memory or prevent resizing.
         *
         * @name Phaser.GameObjects.RenderFilters#maxHeight
         * @type {number}
         * @default 4096
         * @since 4.0.0
         */
        this.maxHeight = 4096;

        /**
         * When decomposite is true, the RenderFilters will not render itself,
         * but will render its child instead.
         *
         * This will skip all filter and camera settings,
         * and otherwise render the child without modification.
         *
         * @name Phaser.GameObjects.RenderFilters#decomposite
         * @type {boolean}
         * @default false
         * @since 4.0.0
         */
        this.decomposite = false;

        /**
         * Whether the RenderFilters should ignore lighting effects.
         *
         * Ordinarily, the RenderFilters will use a DrawingContext which calculates
         * lighting values. Use this flag to skip those calculations.
         * This can improve performance.
         *
         * @name Phaser.GameObjects.RenderFilters#ignoreLighting
         * @type {boolean}
         * @default true
         * @since 4.0.0
         */
        this.ignoreLighting = true;

        /**
         * Whether the RenderFilters should run the child's `preUpdate` method.
         *
         * @name Phaser.GameObjects.RenderFilters#runChildPreUpdate
         * @type {boolean}
         * @default true
         * @since 4.0.0
         */
        this.runChildPreUpdate = true;

        /**
         * Whether the RenderFilters should reinterpret the child every frame
         * via `focusOnChild()`.
         * This is useful for children which change size or origin.
         *
         * @name Phaser.GameObjects.RenderFilters#autoFocus
         * @type {boolean}
         * @default false
         * @since 4.0.0
         */
        this.autoFocus = false;

        /**
         * Whether the RenderFilters should focus on its own context,
         * rather than the child.
         * This is useful for objects which do not have a `getBounds` method.
         *
         * @name Phaser.GameObjects.RenderFilters#autoFocusContext
         * @type {boolean}
         * @default false
         * @since 4.0.0
         */
        this.autoFocusContext = false;

        /**
         * Whether the RenderFilters needs to focus on its own context.
         * It is useful when an object doesn't have `getBounds`,
         * but is expected to stay within a fixed camera view.
         *
         * This flag is deactivated after rendering, so it is a one-time use.
         * Use it to change focus just once.
         *
         * @name Phaser.GameObjects.RenderFilters#needsFocusContext
         * @type {boolean}
         * @default false
         * @since 4.0.0
         */
        this.needsFocusContext = false;

        this.setChild(child, true, true);
        this.initRenderNodes(this._defaultRenderNodesMap);
    },

    /**
    * The default render nodes for this Game Object.
    *
    * @name Phaser.GameObjects.RenderFilters#_defaultRenderNodesMap
    * @type {Map<string, string>}
    * @private
    * @webglOnly
    * @readonly
    * @since 4.0.0
    */
    _defaultRenderNodesMap:
    {
        get: function ()
        {
            return DefaultRenderFiltersNodes;
        }
    },

    //  Overrides Game Object method
    addedToScene: function ()
    {
        this.scene.sys.updateList.add(this);
    },

    //  Overrides Game Object method
    removedFromScene: function ()
    {
        this.scene.sys.updateList.remove(this);
    },

    /**
     * Updates this RenderFilters.
     * If the child has a `preUpdate` method, it will run,
     * unless `runChildPreUpdate` is false.
     *
     * @method Phaser.GameObjects.RenderFilters#preUpdate
     * @since 4.0.0
     * @param {number} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     * @param {number} delta - The delta time in ms since the last frame.
     */
    preUpdate: function (time, delta)
    {
        this.camera.setAlpha(this.alpha);

        if (!this.child) { return; }

        if (this.runChildPreUpdate && this.child.preUpdate)
        {
            this.child.preUpdate(time, delta);
        }

        if (this.autoFocus)
        {
            if (this.autoFocusContext)
            {
                this.needsFocusContext = true;
            }
            else
            {
                this.focusOnChild();
            }
        }
    },

    /**
     * The native (un-scaled) width of this RenderFilters.
     * This is based on the child's width if it exists.
     * The RenderFilters may render at a different size due to scaling
     * or padding from effects.
     *
     * @name Phaser.GameObjects.RenderFilters#width
     * @type {number}
     * @since 3.0.0
     */

    /**
     * The native (un-scaled) height of this RenderFilters.
     * This is based on the child's height if it exists.
     * The RenderFilters may render at a different size due to scaling
     * or padding from effects.
     *
     * @name Phaser.GameObjects.RenderFilters#height
     * @type {number}
     * @since 3.0.0
     */

    displayWidth:
    {
        get: function ()
        {
            return Math.abs(this.scaleX * this.width);
        },

        set: function (value)
        {
            this.scaleX = value / this.width;
        }
    },

    displayHeight:
    {
        get: function ()
        {
            return Math.abs(this.scaleY * this.height);
        },

        set: function (value)
        {
            this.scaleY = value / this.height;
        }
    },

    /**
     * The filters for this object.
     * Filters control special effects and masks.
     *
     * This object contains two lists of filters: `internal` and `external`.
     * See {@link Phaser.GameObjects.Components.FilterList} for more information.
     *
     * This is a reference to the filters of the internal camera.
     *
     * @name Phaser.GameObjects.RenderFilters#filters
     * @type {{ internal: Phaser.GameObjects.Components.FilterList, external: Phaser.GameObjects.Components.FilterList }}
     * @since 4.0.0
     * @readonly
     */
    filters:
    {
        get: function ()
        {
            return this.camera.filters;
        }
    },

    setSize: function (width, height)
    {
        // Sanitize inputs.
        width = Math.max(1, Math.min(Math.ceil(width), this.maxWidth));
        height = Math.max(1, Math.min(Math.ceil(height), this.maxHeight));

        Components.Size.setSize.call(this, width, height);

        // Update the camera size to match the RenderFilters size.
        this.camera.setSize(width, height);

        return this;
    },

    /**
     * Sets the Game Object that this RenderFilters is wrapping.
     * This will transfer the properties of the child to the RenderFilters if `match` is true.
     *
     * The RenderFilters will resize to fit the child.
     * If the child has a width and height, the RenderFilters will match those.
     * Otherwise, the RenderFilters will match the child's bounds.
     *
     * The child will be removed from its current display list.
     * This stops its `preUpdate` method from running.
     * By default, this object will call any `preUpdate` method on the child.
     * You can disable this by setting `runChildPreUpdate` to false.
     *
     * If the RenderFilters already has a child, it will be destroyed.
     *
     * @method Phaser.GameObjects.RenderFilters#setChild
     * @since 4.0.0
     * @param {Phaser.GameObjects.GameObject} child - The Game Object that this RenderFilters will wrap.
     * @param {boolean} [match=false] - Should the RenderFilters transfer the properties of the child to itself? This includes position, rotation, scale, blend mode, flip, visibility, scroll factor, and depth.
     * @return {this} This RenderFilters Game Object.
     */
    setChild: function (child, match)
    {
        // Destroy the current child, if any.
        if (this.child)
        {
            this.child.destroy();
        }

        // Remove the new child from its current display list.
        child.removeFromDisplayList();

        this.child = child;

        if (match)
        {
            this.transferProperties(child, this);
        }

        this.focusOnChild();

        return this;
    },

    /**
     * Removes the child from this RenderFilters and adds it to the Scene's display list.
     * The child will also have its properties set to the RenderFilters's properties
     * via `transferProperties` if `restoreProperties` is true.
     *
     * The child will appear at the end of the display list.
     *
     * @method Phaser.GameObjects.RenderFilters#removeChild
     * @since 4.0.0
     * @return {Phaser.GameObjects.GameObject} The child that was removed.
     */
    removeChild: function (restoreProperties)
    {
        var child = this.child;

        if (child)
        {
            if (restoreProperties)
            {
                this.transferProperties(this, child, true);
            }

            this.child = null;

            child.addToDisplayList();
        }

        return child;
    },

    /**
     * Move shared properties from one GameObject to another.
     * This is used to adapt the RenderFilters to the child,
     * or to transfer properties back to the child if it is removed from the RenderFilters.
     *
     * If properties are not defined on the source GameObject,
     * they will be set to default values.
     * If the destination GameObject does not have a setter for a property,
     * it will be ignored.
     *
     * @method Phaser.GameObjects.RenderFilters#transferProperties
     * @since 4.0.0
     * @param {Phaser.GameObjects.GameObject} source - The source GameObject.
     * @param {Phaser.GameObjects.GameObject} dest - The destination GameObject.
     */
    transferProperties: function (source, dest)
    {
        if (dest.setPosition)
        {
            if (source.x !== undefined && source.y !== undefined)
            {
                dest.setPosition(source.x, source.y);
            }
            else
            {
                dest.setPosition(0, 0);
            }
        }

        if (dest.setOrigin)
        {
            if (source.originX !== undefined && source.originY !== undefined)
            {
                dest.setOrigin(source.originX, source.originY);
            }
            else
            {
                dest.setOrigin(0.5, 0.5);
            }
        }

        if (dest.setRotation)
        {
            if (source.rotation !== undefined)
            {
                dest.setRotation(source.rotation);
            }
            else
            {
                dest.setRotation(0);
            }
        }

        if (dest.setScale)
        {
            if (source.scaleX !== undefined && source.scaleY !== undefined)
            {
                dest.setScale(source.scaleX, source.scaleY);
            }
            else
            {
                dest.setScale(1);
            }
        }

        if (dest.setBlendMode)
        {
            if (source.blendMode !== undefined)
            {
                dest.setBlendMode(source.blendMode);
            }
            else
            {
                dest.setBlendMode(BlendModes.NORMAL);
            }
        }

        if (dest.setFlipX)
        {
            if (source.flipX !== undefined)
            {
                dest.setFlipX(source.flipX);
            }
            else
            {
                dest.setFlipX(false);
            }
        }

        if (dest.setFlipY)
        {
            if (source.flipY !== undefined)
            {
                dest.setFlipY(source.flipY);
            }
            else
            {
                dest.setFlipY(false);
            }
        }

        if (dest.setVisible)
        {
            if (source.visible !== undefined)
            {
                dest.setVisible(source.visible);
            }
            else
            {
                dest.setVisible(true);
            }
        }

        if (dest.setScrollFactor)
        {
            if (source.scrollFactorX !== undefined && source.scrollFactorY !== undefined)
            {
                dest.setScrollFactor(source.scrollFactorX, source.scrollFactorY);
            }
            else
            {
                dest.setScrollFactor(1);
            }
        }

        if (dest.setDepth)
        {
            if (source.depth !== undefined)
            {
                dest.setDepth(source.depth);
            }
            else
            {
                dest.setDepth(0);
            }
        }
    },

    /**
     * Focus the internal camera to a given position and size.
     * This will set the camera size and scroll, and this object's origin.
     *
     * The camera will set scroll to place the child at the given position
     * within a rectangle of the given width and height.
     * For example, calling `focus(400, 200, 800, 600)` will focus the camera
     * to place the child's center 100 pixels above the center of the camera
     * (which is at 400, 300).
     *
     * @method Phaser.GameObjects.RenderFilters#focus
     * @since 4.0.0
     * @param {number} [x] - The x-coordinate of the focus point, relative to the size of the RenderFilters. Default is the center.
     * @param {number} [y] - The y-coordinate of the focus point, relative to the size of the RenderFilters. Default is the center.
     * @param {number} [width] - The width of the focus rectangle. Default is the current RenderFilters width.
     * @param {number} [height] - The height of the focus rectangle. Default is the current RenderFilters height.
     * @returns {this} This RenderFilters Game Object.
     */
    focus: function (x, y, width, height)
    {
        // Maintain size.
        if (width === undefined) { width = this.width; }
        if (height === undefined) { height = this.height; }

        // Default to center.
        if (x === undefined) { x = width / 2; }
        if (y === undefined) { y = height / 2; }

        var childX = 0;
        var childY = 0;
        if (this.child)
        {
            childX = this.child.x;
            childY = this.child.y;
        }

        this.setSize(width, height);
        this.camera.setScroll(childX - x, childY - y);
        this.setOrigin(x / width, y / height);

        // Stop automatic focus.
        this.autoFocus = false;
        this.needsFocusContext = false;

        return this;
    },

    /**
     * Orient the internal camera to fit the child.
     * This will set this object's origin, and adjust the internal camera.
     *
     * If the child has no bounds, it cannot be focused, and the RenderFilters
     * will automatically activate `autoFocusContext` to use the bounds
     * of the camera which is rendering the RenderFilters.
     *
     * Caution: this method can change the RenderFilters size,
     * which can be expensive as new framebuffers are requested. Use sparingly.
     *
     * @method Phaser.GameObjects.RenderFilters#focusOnChild
     * @since 4.0.0
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - A camera to use instead of the child's bounds. This is used by the renderer when `autoFocusContext` is on.
     * @returns {this} This RenderFilters Game Object.
     */
    focusOnChild: function (camera)
    {
        var child = this.child;

        if (!child)
        {
            return this;
        }

        var rotation = child.rotation;
        var scaleX = child.scaleX;
        var scaleY = child.scaleY;

        if (!camera)
        {
            var bounds = this._getChildBounds();
        }

        // If the child has no bounds, focus on the RenderFilters context.
        if (!bounds)
        {
            if (camera)
            {
                bounds = new Rectangle(camera.scrollX, camera.scrollY, camera.width, camera.height);
                rotation = -camera.rotation;
                scaleX = 1 / camera.zoomX;
                scaleY = 1 / camera.zoomY;
            }
            else
            {
                this.needsFocusContext = true;
                this.autoFocusContext = true;
                return this;
            }
        }
        this.needsFocusContext = false;
        this.autoFocusContext = false;

        // Set the size to match the child.
        var width = bounds.width;
        var height = bounds.height;
        this.setSize(width, height);

        // Set the camera to match the child.
        var internalCamera = this.camera;
        var centerX = width === 0 ? child.x : bounds.centerX;
        var centerY = height === 0 ? child.y : bounds.centerY;
        var x = centerX - this.width / 2;
        var y = centerY - this.height / 2;

        internalCamera.setScroll(x, y);
        internalCamera.setRotation(-rotation);
        internalCamera.setZoom(1 / scaleX, 1 / scaleY);

        this.setOrigin(
            0.5 + (child.x - centerX) / this.width,
            0.5 + (child.y - centerY) / this.height
        );

        return this;
    },

    /**
     * Returns the bounds of the child.
     *
     * If the child exists, and has a `getBounds` method,
     * it will temporarily reorient the child to get axis-aligned bounds,
     * and if the bounds have non-zero widht and height,
     * it will return those bounds.
     * Otherwise, it will return null.
     *
     * @method Phaser.GameObjects.RenderFilters#_getChildBounds
     * @private
     * @since 4.0.0
     * @returns {?Phaser.Geom.Rectangle} The bounds of the child, or null if the child does not exist or does not have a `getBounds` method.
     */
    _getChildBounds: function ()
    {
        var child = this.child;

        if (!child || !child.getBounds) { return null; }

        // Temporarily reorient the child to get axis-aligned bounds.
        var rotation = child.rotation;
        var scaleX = child.scaleX;
        var scaleY = child.scaleY;

        child.setRotation(0);
        child.setScale(1);

        var bounds = child.getBounds();

        child.setScale(scaleX, scaleY);
        child.setRotation(rotation);

        if (bounds.width === 0 || bounds.height === 0)
        {
            return null;
        }

        return bounds;
    }
});

module.exports = RenderFilters;
