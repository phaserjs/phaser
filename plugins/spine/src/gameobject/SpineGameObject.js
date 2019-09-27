/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var AngleBetween = require('../../../../src/math/angle/Between');
var Clamp = require('../../../../src/math/Clamp');
var Class = require('../../../../src/utils/Class');
var ComponentsComputedSize = require('../../../../src/gameobjects/components/ComputedSize');
var ComponentsDepth = require('../../../../src/gameobjects/components/Depth');
var ComponentsFlip = require('../../../../src/gameobjects/components/Flip');
var ComponentsScrollFactor = require('../../../../src/gameobjects/components/ScrollFactor');
var ComponentsTransform = require('../../../../src/gameobjects/components/Transform');
var ComponentsVisible = require('../../../../src/gameobjects/components/Visible');
var CounterClockwise = require('../../../../src/math/angle/CounterClockwise');
var DegToRad = require('../../../../src/math/DegToRad');
var GameObject = require('../../../../src/gameobjects/GameObject');
var RadToDeg = require('../../../../src/math/RadToDeg');
var SpineEvents = require('../events/');
var SpineGameObjectRender = require('./SpineGameObjectRender');

/**
 * @classdesc
 * A Spine Game Object is a Phaser level object that can be added to your Phaser Scenes. It encapsulates
 * a Spine Skeleton with Spine Animation Data and Animation State, with helper methods to allow you to
 * easily change the skin, slot attachment, bone positions and more.
 * 
 * Spine Game Objects can be created via the Game Object Factory, Game Object Creator, or directly.
 * You can only create them if the Spine plugin has been loaded into Phaser.
 * 
 * The quickest way is the Game Object Factory:
 * 
 * ```javascript
 * let jelly = this.add.spine(512, 550, 'jelly', 'jelly-think', true);
 * ```
 * 
 * Here we are creating a new Spine Game Object positioned at 512 x 550. It's using the `jelly`
 * Spine data, which has previously been loaded into your Scene. The `jelly-think` argument is
 * an optional animation to start playing on the skeleton. The final argument `true` sets the
 * animation to loop. Look at the documentation for further details on each of these options.
 * 
 * For more control, you can use the Game Object Creator, passing in a Spine Game Object
 * Configuration object:
 * 
 * ```javascript
 * let jelly = this.make.spine({
 *     x: 512, y: 550, key: 'jelly',
 *     scale: 1.5,
 *     skinName: 'square_Green',
 *     animationName: 'jelly-think', loop: true,
 *     slotName: 'hat', attachmentName: 'images/La_14'
 * });
 * ```
 * 
 * Here, you've got the ability to specify extra details, such as the slot name, attachments or
 * overall scale.
 * 
 * If you wish to instantiate a Spine Game Object directly you can do so, but in order for it to
 * update and render, it must be added to the display and update lists of your Scene:
 * 
 * ```javascript
 * let jelly = new SpineGameObject(this, this.spine, 512, 550, 'jelly', 'jelly-think', true);
 * this.sys.displayList.add(jelly);
 * this.sys.updateList.add(jelly);
 * ```
 * 
 * It's possible to enable Spine Game Objects for input, but you should be aware that it will use
 * the bounds of the skeletons current pose to create the hit area from. Sometimes this is ok, but
 * often not. Make use of the `InputPlugin.enableDebug` method to view the input shape being created.
 * If it's not suitable, provide your own shape to the `setInteractive` method.
 * 
 * Due to the way Spine handles scaling, it's not recommended to enable a Spine Game Object for
 * physics directly. Instead, you should look at creating a proxy body and syncing the Spine Game
 * Object position with it. See the examples for further details.
 * 
 * If your Spine Game Object has black outlines around the different parts of the texture when it
 * renders then you have exported the files from Spine with pre-multiplied alpha enabled, but have
 * forgotten to set that flag when loading the Spine data. Please see the loader docs for more details.
 *
 * @class SpineGameObject
 * @constructor
 * @since 3.19.0
 *
 * @param {Phaser.Scene} scene - A reference to the Scene that this Game Object belongs to.
 * @param {SpinePlugin} pluginManager - A reference to the Phaser Spine Plugin.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {string} [key] - The key of the Spine Skeleton this Game Object will use, as stored in the Spine Plugin.
 * @param {string} [animationName] - The name of the animation to set on this Skeleton.
 * @param {boolean} [loop=false] - Should the animation playback be looped or not?
 */
var SpineGameObject = new Class({

    Extends: GameObject,

    Mixins: [
        ComponentsComputedSize,
        ComponentsDepth,
        ComponentsFlip,
        ComponentsScrollFactor,
        ComponentsTransform,
        ComponentsVisible,
        SpineGameObjectRender
    ],

    initialize:

    function SpineGameObject (scene, plugin, x, y, key, animationName, loop)
    {
        GameObject.call(this, scene, 'Spine');

        /**
         * A reference to the Spine Plugin.
         *
         * @name SpineGameObject#plugin
         * @type {SpinePlugin}
         * @since 3.19.0
         */
        this.plugin = plugin;

        /**
         * The Spine Skeleton this Game Object is using.
         *
         * @name SpineGameObject#skeleton
         * @type {spine.Skeleton}
         * @since 3.19.0
         */
        this.skeleton = null;

        /**
         * The Spine Skeleton Data associated with the Skeleton this Game Object is using.
         *
         * @name SpineGameObject#skeletonData
         * @type {spine.SkeletonData}
         * @since 3.19.0
         */
        this.skeletonData = null;

        /**
         * The Spine Animation State this Game Object is using.
         *
         * @name SpineGameObject#state
         * @type {spine.AnimationState}
         * @since 3.19.0
         */
        this.state = null;

        /**
         * The Spine Animation State Data associated with the Animation State this Game Object is using.
         *
         * @name SpineGameObject#stateData
         * @type {spine.AnimationStateData}
         * @since 3.19.0
         */
        this.stateData = null;

        /**
         * A reference to the root bone of the Skeleton.
         *
         * @name SpineGameObject#root
         * @type {spine.Bone}
         * @since 3.19.0
         */
        this.root = null;

        /**
         * This object holds the calculated bounds of the current
         * pose, as set when a new Skeleton is applied.
         *
         * @name SpineGameObject#bounds
         * @type {any}
         * @since 3.19.0
         */
        this.bounds = null;
        
        /**
         * A Game Object level flag that allows you to enable debug drawing
         * to the Skeleton Debug Renderer by toggling it.
         *
         * @name SpineGameObject#drawDebug
         * @type {boolean}
         * @since 3.19.0
         */
        this.drawDebug = false;

        /**
         * The factor to scale the Animation update time by.
         *
         * @name SpineGameObject#timeScale
         * @type {number}
         * @since 3.19.0
         */
        this.timeScale = 1;

        /**
         * The calculated Display Origin of this Game Object.
         *
         * @name SpineGameObject#displayOriginX
         * @type {number}
         * @since 3.19.0
         */
        this.displayOriginX = 0;

        /**
         * The calculated Display Origin of this Game Object.
         *
         * @name SpineGameObject#displayOriginY
         * @type {number}
         * @since 3.19.0
         */
        this.displayOriginY = 0;

        /**
         * A flag that stores if the texture associated with the current
         * Skin being used by this Game Object, has its alpha pre-multiplied
         * into it, or not.
         *
         * @name SpineGameObject#preMultipliedAlpha
         * @type {boolean}
         * @since 3.19.0
         */
        this.preMultipliedAlpha = false;

        /**
         * A default Blend Mode. You cannot change the blend mode of a
         * Spine Game Object.
         *
         * @name SpineGameObject#blendMode
         * @type {number}
         * @readonly
         * @since 3.19.0
         */
        this.blendMode = 0;

        this.setPosition(x, y);

        if (key)
        {
            this.setSkeleton(key, animationName, loop);
        }
    },

    /**
     * Overrides the default Game Object method and always returns true.
     * Rendering is decided in the renderer functions.
     *
     * @method SpineGameObject#willRender
     * @since 3.19.0
     *
     * @return {boolean} Always returns `true`.
     */
    willRender: function ()
    {
        return true;
    },

    /**
     * Set the Alpha level for the whole Skeleton of this Game Object.
     * 
     * The alpha controls the opacity of the Game Object as it renders.
     * 
     * Alpha values are provided as a float between 0, fully transparent, and 1, fully opaque.
     *
     * @method SpineGameObject#setAlpha
     * @since 3.19.0
     *
     * @param {number} [value=1] - The alpha value used for the whole Skeleton.
     *
     * @return {this} This Game Object instance.
     */
    setAlpha: function (value, slotName)
    {
        if (value === undefined) { value = 1; }

        if (slotName)
        {
            var slot = this.findSlot(slotName);

            if (slot)
            {
                slot.color.a = Clamp(value, 0, 1);
            }
        }
        else
        {
            this.alpha = value;
        }

        return this;
    },

    /**
     * The alpha value of the Skeleton.
     * 
     * A value between 0 and 1.
     *
     * This is a global value, impacting the entire Skeleton, not just a region of it.
     *
     * @name SpineGameObject#alpha
     * @type {number}
     * @since 3.19.0
     */
    alpha: {

        get: function ()
        {
            return this.skeleton.color.a;
        },

        set: function (value)
        {
            var v = Clamp(value, 0, 1);

            if (this.skeleton)
            {
                this.skeleton.color.a = v;
            }

            if (v === 0)
            {
                this.renderFlags &= ~2;
            }
            else
            {
                this.renderFlags |= 2;
            }
        }

    },

    /**
     * The amount of red used when rendering the Skeleton.
     * 
     * A value between 0 and 1.
     *
     * This is a global value, impacting the entire Skeleton, not just a region of it.
     *
     * @name SpineGameObject#red
     * @type {number}
     * @since 3.19.0
     */
    red: {

        get: function ()
        {
            return this.skeleton.color.r;
        },

        set: function (value)
        {
            var v = Clamp(value, 0, 1);

            if (this.skeleton)
            {
                this.skeleton.color.r = v;
            }
        }

    },

    /**
     * The amount of green used when rendering the Skeleton.
     * 
     * A value between 0 and 1.
     *
     * This is a global value, impacting the entire Skeleton, not just a region of it.
     *
     * @name SpineGameObject#green
     * @type {number}
     * @since 3.19.0
     */
    green: {

        get: function ()
        {
            return this.skeleton.color.g;
        },

        set: function (value)
        {
            var v = Clamp(value, 0, 1);

            if (this.skeleton)
            {
                this.skeleton.color.g = v;
            }
        }

    },

    /**
     * The amount of blue used when rendering the Skeleton.
     * 
     * A value between 0 and 1.
     *
     * This is a global value, impacting the entire Skeleton, not just a region of it.
     *
     * @name SpineGameObject#blue
     * @type {number}
     * @since 3.19.0
     */
    blue: {

        get: function ()
        {
            return this.skeleton.color.b;
        },

        set: function (value)
        {
            var v = Clamp(value, 0, 1);

            if (this.skeleton)
            {
                this.skeleton.color.b = v;
            }
        }

    },

    /**
     * Sets the color on the given attachment slot. Or, if no slot is given, on the whole skeleton.
     *
     * @method SpineGameObject#setColor
     * @since 3.19.0
     *
     * @param {integer} [color=0xffffff] - The color being applied to the Skeleton or named Slot. Set to white to disable any previously set color.
     * @param {string} [slotName] - The name of the slot to set the color on. If not give, will be set on the whole skeleton.
     * 
     * @return {this} This Game Object instance.
     */
    setColor: function (color, slotName)
    {
        if (color === undefined) { color = 0xffffff; }

        var red = (color >> 16 & 0xFF) / 255;
        var green = (color >> 8 & 0xFF) / 255;
        var blue = (color & 0xFF) / 255;
        var alpha = (color > 16777215) ? (color >>> 24) / 255 : null;

        var target = this.skeleton;

        if (slotName)
        {
            var slot = this.findSlot(slotName);

            if (slot)
            {
                target = slot;
            }
        }

        target.color.r = red;
        target.color.g = green;
        target.color.b = blue;

        if (alpha !== null)
        {
            target.color.a = alpha;
        }

        return this;
    },

    /**
     * Sets this Game Object to use the given Skeleton based on the Atlas Data Key and a provided JSON object
     * that contains the Skeleton data.
     *
     * @method SpineGameObject#setSkeletonFromJSON
     * @since 3.19.0
     * 
     * @param {string} atlasDataKey - The key of the Spine data to use for this Skeleton.
     * @param {object} skeletonJSON - The JSON data for the Skeleton.
     * @param {string} [animationName] - Optional name of the animation to set on the Skeleton.
     * @param {boolean} [loop=false] - Should the animation, if set, loop or not?
     *
     * @return {this} This Game Object.
     */
    setSkeletonFromJSON: function (atlasDataKey, skeletonJSON, animationName, loop)
    {
        return this.setSkeleton(atlasDataKey, skeletonJSON, animationName, loop);
    },

    /**
     * Sets this Game Object to use the given Skeleton based on its cache key.
     * 
     * Typically, once set, the Skeleton doesn't change. Instead, you change the skin,
     * or slot attachment, or any other property to adjust it.
     *
     * @method SpineGameObject#setSkeleton
     * @since 3.19.0
     * 
     * @param {string} atlasDataKey - The key of the Spine data to use for this Skeleton.
     * @param {object} skeletonJSON - The JSON data for the Skeleton.
     * @param {string} [animationName] - Optional name of the animation to set on the Skeleton.
     * @param {boolean} [loop=false] - Should the animation, if set, loop or not?
     *
     * @return {this} This Game Object.
     */
    setSkeleton: function (atlasDataKey, animationName, loop, skeletonJSON)
    {
        if (this.state)
        {
            this.state.clearListeners();
            this.state.clearListenerNotifications();
        }

        var data = this.plugin.createSkeleton(atlasDataKey, skeletonJSON);

        this.skeletonData = data.skeletonData;

        this.preMultipliedAlpha = data.preMultipliedAlpha;

        var skeleton = data.skeleton;

        skeleton.setSkin();
        skeleton.setToSetupPose();

        this.skeleton = skeleton;

        //  AnimationState
        data = this.plugin.createAnimationState(skeleton);

        if (this.state)
        {
            this.state.clearListeners();
            this.state.clearListenerNotifications();
        }

        this.state = data.state;
        this.stateData = data.stateData;

        this.state.addListener({
            event: this.onEvent.bind(this),
            complete: this.onComplete.bind(this),
            start: this.onStart.bind(this),
            end: this.onEnd.bind(this),
            dispose: this.onDispose.bind(this),
            interrupted: this.onInterrupted.bind(this)
        });

        if (animationName)
        {
            this.setAnimation(0, animationName, loop);
        }

        this.root = this.getRootBone();

        if (this.root)
        {
            //  +90 degrees to account for the difference in Spine vs. Phaser rotation
            this.root.rotation = RadToDeg(CounterClockwise(this.rotation)) + 90;
        }

        this.state.apply(skeleton);

        skeleton.updateCache();

        return this.updateSize();
    },

    /**
     * Internal event handler that emits the Spine onComplete event via this Game Object.
     *
     * @method SpineGameObject#onComplete
     * @fires SpinePluginEvents#COMPLETE
     * @private
     * @since 3.19.0
     * 
     * @param {any} entry - The event data from Spine.
     */
    onComplete: function (entry)
    {
        this.emit(SpineEvents.COMPLETE, entry);
    },

    /**
     * Internal event handler that emits the Spine onDispose event via this Game Object.
     *
     * @method SpineGameObject#onDispose
     * @fires SpinePluginEvents#DISPOSE
     * @private
     * @since 3.19.0
     * 
     * @param {any} entry - The event data from Spine.
     */
    onDispose: function (entry)
    {
        this.emit(SpineEvents.DISPOSE, entry);
    },

    /**
     * Internal event handler that emits the Spine onEnd event via this Game Object.
     *
     * @method SpineGameObject#onEnd
     * @fires SpinePluginEvents#END
     * @private
     * @since 3.19.0
     * 
     * @param {any} entry - The event data from Spine.
     */
    onEnd: function (entry)
    {
        this.emit(SpineEvents.END, entry);
    },

    /**
     * Internal event handler that emits the Spine Event event via this Game Object.
     *
     * @method SpineGameObject#onEvent
     * @fires SpinePluginEvents#EVENT
     * @private
     * @since 3.19.0
     * 
     * @param {any} entry - The event data from Spine.
     * @param {spine.Event} event - The Spine event.
     */
    onEvent: function (entry, event)
    {
        this.emit(SpineEvents.EVENT, entry, event);
    },

    /**
     * Internal event handler that emits the Spine onInterrupted event via this Game Object.
     *
     * @method SpineGameObject#onInterrupted
     * @fires SpinePluginEvents#INTERRUPTED
     * @private
     * @since 3.19.0
     * 
     * @param {any} entry - The event data from Spine.
     */
    onInterrupted: function (entry)
    {
        this.emit(SpineEvents.INTERRUPTED, entry);
    },

    /**
     * Internal event handler that emits the Spine onStart event via this Game Object.
     *
     * @method SpineGameObject#onStart
     * @fires SpinePluginEvents#START
     * @private
     * @since 3.19.0
     * 
     * @param {any} entry - The event data from Spine.
     */
    onStart: function (entry)
    {
        this.emit(SpineEvents.START, entry);
    },

    /**
     * Refreshes the data about the current Skeleton.
     * 
     * This will reset the rotation, position and size of the Skeleton to match this Game Object.
     * 
     * Call this method if you need to access the Skeleton data directly, and it may have changed
     * recently.
     *
     * @method SpineGameObject#refresh
     * @since 3.19.0
     * 
     * @return {this} This Game Object.
     */
    refresh: function ()
    {
        if (this.root)
        {
            //  +90 degrees to account for the difference in Spine vs. Phaser rotation
            this.root.rotation = RadToDeg(CounterClockwise(this.rotation)) + 90;
        }

        this.updateSize();

        this.skeleton.updateCache();

        return this;
    },

    /**
     * Sets the size of this Game Object.
     * 
     * If no arguments are given it uses the current skeleton data dimensions.
     * 
     * You can use this method to set a fixed size of this Game Object, such as for input detection,
     * when the skeleton data doesn't match what is required in-game.
     *
     * @method SpineGameObject#setSize
     * @since 3.19.0
     * 
     * @param {number} [width] - The width of the Skeleton. If not given it defaults to the Skeleton Data width.
     * @param {number} [height] - The height of the Skeleton. If not given it defaults to the Skeleton Data height.
     * @param {number} [offsetX=0] - The horizontal offset of the Skeleton from its x and y coordinate.
     * @param {number} [offsetY=0] - The vertical offset of the Skeleton from its x and y coordinate.
     * 
     * @return {this} This Game Object.
     */
    setSize: function (width, height, offsetX, offsetY)
    {
        var skeleton = this.skeleton;

        if (width === undefined) { width = skeleton.data.width; }
        if (height === undefined) { height = skeleton.data.height; }
        if (offsetX === undefined) { offsetX = 0; }
        if (offsetY === undefined) { offsetY = 0; }

        this.width = width;
        this.height = height;

        this.displayOriginX = skeleton.x - offsetX;
        this.displayOriginY = skeleton.y - offsetY;

        return this;
    },

    /**
     * Sets the offset of this Game Object from the Skeleton position.
     * 
     * You can use this method to adjust how the position of this Game Object relates to the Skeleton it is using.
     *
     * @method SpineGameObject#setOffset
     * @since 3.19.0
     * 
     * @param {number} [offsetX=0] - The horizontal offset of the Skeleton from its x and y coordinate.
     * @param {number} [offsetY=0] - The vertical offset of the Skeleton from its x and y coordinate.
     * 
     * @return {this} This Game Object.
     */
    setOffset: function (offsetX, offsetY)
    {
        var skeleton = this.skeleton;

        if (offsetX === undefined) { offsetX = 0; }
        if (offsetY === undefined) { offsetY = 0; }

        this.displayOriginX = skeleton.x - offsetX;
        this.displayOriginY = skeleton.y - offsetY;

        return this;
    },

    /**
     * Internal method that syncs all of the Game Object position and scale data to the Skeleton.
     * It then syncs the skeleton bounds back to this Game Object.
     * 
     * This method is called automatically as needed internally, however, it's also exposed should
     * you require overriding the size settings.
     *
     * @method SpineGameObject#updateSize
     * @since 3.19.0
     * 
     * @return {this} This Game Object.
     */
    updateSize: function ()
    {
        var skeleton = this.skeleton;
        var renderer = this.plugin.renderer;

        var height = renderer.height;

        var oldScaleX = this.scaleX;
        var oldScaleY = this.scaleY;

        skeleton.x = this.x;
        skeleton.y = height - this.y;
        skeleton.scaleX = 1;
        skeleton.scaleY = 1;

        skeleton.updateWorldTransform();

        var bounds = this.getBounds();

        this.width = bounds.size.x;
        this.height = bounds.size.y;

        this.displayOriginX = this.x - bounds.offset.x;
        this.displayOriginY = this.y - (height - (this.height + bounds.offset.y));

        skeleton.scaleX = oldScaleX;
        skeleton.scaleY = oldScaleY;

        skeleton.updateWorldTransform();

        return this;
    },

    /**
     * The horizontal scale of this Game Object, as applied to the Skeleton it is using.
     *
     * @name SpineGameObject#scaleX
     * @type {number}
     * @default 1
     * @since 3.19.0
     */
    scaleX: {

        get: function ()
        {
            return this._scaleX;
        },

        set: function (value)
        {
            this._scaleX = value;

            this.refresh();
        }

    },

    /**
     * The vertical scale of this Game Object, as applied to the Skeleton it is using.
     *
     * @name SpineGameObject#scaleY
     * @type {number}
     * @default 1
     * @since 3.19.0
     */
    scaleY: {

        get: function ()
        {
            return this._scaleY;
        },

        set: function (value)
        {
            this._scaleY = value;

            this.refresh();
        }

    },

    /**
     * Returns an array containing the names of all the bones in the Skeleton Data.
     *
     * @method SpineGameObject#getBoneList
     * @since 3.19.0
     * 
     * @return {string[]} An array containing the names of all the bones in the Skeleton Data.
     */
    getBoneList: function ()
    {
        var output = [];

        var skeletonData = this.skeletonData;

        if (skeletonData)
        {
            for (var i = 0; i < skeletonData.bones.length; i++)
            {
                output.push(skeletonData.bones[i].name);
            }
        }

        return output;
    },

    /**
     * Returns an array containing the names of all the skins in the Skeleton Data.
     *
     * @method SpineGameObject#getSkinList
     * @since 3.19.0
     * 
     * @return {string[]} An array containing the names of all the skins in the Skeleton Data.
     */
    getSkinList: function ()
    {
        var output = [];

        var skeletonData = this.skeletonData;

        if (skeletonData)
        {
            for (var i = 0; i < skeletonData.skins.length; i++)
            {
                output.push(skeletonData.skins[i].name);
            }
        }

        return output;
    },

    /**
     * Returns an array containing the names of all the slots in the Skeleton.
     *
     * @method SpineGameObject#getSlotList
     * @since 3.19.0
     * 
     * @return {string[]} An array containing the names of all the slots in the Skeleton.
     */
    getSlotList: function ()
    {
        var output = [];

        var skeleton = this.skeleton;

        for (var i = 0; i < skeleton.slots.length; i++)
        {
            output.push(skeleton.slots[i].data.name);
        }

        return output;
    },

    /**
     * Returns an array containing the names of all the animations in the Skeleton Data.
     *
     * @method SpineGameObject#getAnimationList
     * @since 3.19.0
     * 
     * @return {string[]} An array containing the names of all the animations in the Skeleton Data.
     */
    getAnimationList: function ()
    {
        var output = [];

        var skeletonData = this.skeletonData;

        if (skeletonData)
        {
            for (var i = 0; i < skeletonData.animations.length; i++)
            {
                output.push(skeletonData.animations[i].name);
            }
        }

        return output;
    },

    /**
     * Returns the current animation being played on the given track, if any.
     *
     * @method SpineGameObject#getCurrentAnimation
     * @since 3.19.0
     * 
     * @param {integer} [trackIndex=0] - The track to return the current animation on.
     * 
     * @return {?spine.Animation} The current Animation on the given track, or `undefined` if there is no current animation.
     */
    getCurrentAnimation: function (trackIndex)
    {
        if (trackIndex === undefined) { trackIndex = 0; }

        var current = this.state.getCurrent(trackIndex);

        if (current)
        {
            return current.animation;
        }
    },

    /**
     * Sets the current animation for a track, discarding any queued animations.
     * If the formerly current track entry was never applied to a skeleton, it is replaced (not mixed from).
     * 
     * Animations are referenced by a unique string-based key, as defined in the Spine software.
     *
     * @method SpineGameObject#play
     * @fires SpinePluginEvents#START
     * @since 3.19.0
     *
     * @param {string} animationName - The string-based key of the animation to play.
     * @param {boolean} [loop=false] - Should the animation be looped when played?
     * @param {boolean} [ignoreIfPlaying=false] - If this animation is already playing then ignore this call.
     *
     * @return {this} This Game Object. If you need the TrackEntry, see `setAnimation` instead.
     */
    play: function (animationName, loop, ignoreIfPlaying)
    {
        this.setAnimation(0, animationName, loop, ignoreIfPlaying);

        return this;
    },

    /**
     * Sets the current animation for a track, discarding any queued animations.
     * If the formerly current track entry was never applied to a skeleton, it is replaced (not mixed from).
     * 
     * Animations are referenced by a unique string-based key, as defined in the Spine software.
     *
     * @method SpineGameObject#setAnimation
     * @fires SpinePluginEvents#START
     * @since 3.19.0
     *
     * @param {integer} trackIndex - The track index to play the animation on.
     * @param {string} animationName - The string-based key of the animation to play.
     * @param {boolean} [loop=false] - Should the animation be looped when played?
     * @param {boolean} [ignoreIfPlaying=false] - If this animation is already playing then ignore this call.
     *
     * @return {spine.TrackEntry} A track entry to allow further customization of animation playback.
     */
    setAnimation: function (trackIndex, animationName, loop, ignoreIfPlaying)
    {
        if (loop === undefined) { loop = false; }
        if (ignoreIfPlaying === undefined) { ignoreIfPlaying = false; }

        if (ignoreIfPlaying && this.state)
        {
            var currentTrack = this.state.getCurrent(0);
 
            if (currentTrack && currentTrack.animation.name === animationName && !currentTrack.isComplete())
            {
                return;
            }
        }

        if (this.findAnimation(animationName))
        {
            return this.state.setAnimation(trackIndex, animationName, loop);
        }
    },

    /**
     * Adds an animation to be played after the current or last queued animation for a track.
     * If the track is empty, it is equivalent to calling setAnimation.
     * 
     * Animations are referenced by a unique string-based key, as defined in the Spine software.
     * 
     * The delay is a float. If > 0, sets delay. If <= 0, the delay set is the duration of the previous
     * track entry minus any mix duration (from the AnimationStateData) plus the specified delay
     * (ie the mix ends at (delay = 0) or before (delay < 0) the previous track entry duration).
     * If the previous entry is looping, its next loop completion is used instead of its duration.
     *
     * @method SpineGameObject#addAnimation
     * @since 3.19.0
     *
     * @param {integer} trackIndex - The track index to add the animation to.
     * @param {string} animationName - The string-based key of the animation to add.
     * @param {boolean} [loop=false] - Should the animation be looped when played?
     * @param {integer} [delay=0] - A delay, in ms, before which this animation will start when played.
     *
     * @return {spine.TrackEntry} A track entry to allow further customization of animation playback.
     */
    addAnimation: function (trackIndex, animationName, loop, delay)
    {
        return this.state.addAnimation(trackIndex, animationName, loop, delay);
    },

    /**
     * Sets an empty animation for a track, discarding any queued animations, and sets the track
     * entry's mixDuration. An empty animation has no timelines and serves as a placeholder for mixing in or out.
     * 
     * Mixing out is done by setting an empty animation with a mix duration using either setEmptyAnimation,
     * setEmptyAnimations, or addEmptyAnimation. Mixing to an empty animation causes the previous animation to be
     * applied less and less over the mix duration. Properties keyed in the previous animation transition to
     * the value from lower tracks or to the setup pose value if no lower tracks key the property.
     * A mix duration of 0 still mixes out over one frame.
     * 
     * Mixing in is done by first setting an empty animation, then adding an animation using addAnimation
     * and on the returned track entry, set the mixDuration. Mixing from an empty animation causes the new
     * animation to be applied more and more over the mix duration. Properties keyed in the new animation
     * transition from the value from lower tracks or from the setup pose value if no lower tracks key the
     * property to the value keyed in the new animation.
     *
     * @method SpineGameObject#setEmptyAnimation
     * @since 3.19.0
     *
     * @param {integer} trackIndex - The track index to add the animation to.
     * @param {integer} [mixDuration] - Seconds for mixing from the previous animation to this animation. Defaults to the value provided by AnimationStateData getMix based on the animation before this animation (if any).
     *
     * @return {spine.TrackEntry} The returned Track Entry.
     */
    setEmptyAnimation: function (trackIndex, mixDuration)
    {
        return this.state.setEmptyAnimation(trackIndex, mixDuration);
    },

    /**
     * Removes all animations from the track, leaving skeletons in their current pose.
     * 
     * It may be desired to use setEmptyAnimation to mix the skeletons back to the setup pose,
     * rather than leaving them in their current pose.
     *
     * @method SpineGameObject#clearTrack
     * @since 3.19.0
     *
     * @param {integer} trackIndex - The track index to add the animation to.
     *
     * @return {this} This Game Object.
     */
    clearTrack: function (trackIndex)
    {
        this.state.clearTrack(trackIndex);

        return this;
    },
     
    /**
     * Removes all animations from all tracks, leaving skeletons in their current pose.
     * 
     * It may be desired to use setEmptyAnimation to mix the skeletons back to the setup pose,
     * rather than leaving them in their current pose.
     *
     * @method SpineGameObject#clearTracks
     * @since 3.19.0
     *
     * @return {this} This Game Object.
     */
    clearTracks: function ()
    {
        this.state.clearTracks();

        return this;
    },

    /**
     * Sets the skin used to look up attachments before looking in the defaultSkin.
     * 
     * Attachments from the new skin are attached if the corresponding attachment from the
     * old skin was attached. If there was no old skin, each slot's setup mode attachment is
     * attached from the new skin.
     * 
     * After changing the skin, the visible attachments can be reset to those attached in the
     * setup pose by calling setSlotsToSetupPose. Also, often apply is called before the next time
     * the skeleton is rendered to allow any attachment keys in the current animation(s) to hide
     * or show attachments from the new skin.
     *
     * @method SpineGameObject#setSkinByName
     * @since 3.19.0
     * 
     * @param {string} skinName - The name of the skin to set.
     *
     * @return {this} This Game Object.
     */
    setSkinByName: function (skinName)
    {
        var skeleton = this.skeleton;

        skeleton.setSkinByName(skinName);

        skeleton.setSlotsToSetupPose();

        this.state.apply(skeleton);

        return this;
    },

    /**
     * Sets the skin used to look up attachments before looking in the defaultSkin.
     * 
     * Attachments from the new skin are attached if the corresponding attachment from the
     * old skin was attached. If there was no old skin, each slot's setup mode attachment is
     * attached from the new skin.
     * 
     * After changing the skin, the visible attachments can be reset to those attached in the
     * setup pose by calling setSlotsToSetupPose. Also, often apply is called before the next time
     * the skeleton is rendered to allow any attachment keys in the current animation(s) to hide
     * or show attachments from the new skin.
     *
     * @method SpineGameObject#setSkin
     * @since 3.19.0
     * 
     * @param {?spine.Skin} newSkin - The Skin to set. May be `null`.
     *
     * @return {this} This Game Object.
     */
    setSkin: function (newSkin)
    {
        var skeleton = this.skeleton;

        skeleton.setSkin(newSkin);

        skeleton.setSlotsToSetupPose();

        this.state.apply(skeleton);

        return this;
    },

    /**
     * Sets the mix duration when changing from the specified animation to the other.
     *
     * @method SpineGameObject#setMix
     * @since 3.19.0
     * 
     * @param {string} fromName - The animation to mix from.
     * @param {string} toName - The animation to mix to.
     * @param {number} [duration] - Seconds for mixing from the previous animation to this animation. Defaults to the value provided by AnimationStateData getMix based on the animation before this animation (if any).
     *
     * @return {this} This Game Object.
     */
    setMix: function (fromName, toName, duration)
    {
        this.stateData.setMix(fromName, toName, duration);

        return this;
    },

    /**
     * Finds an attachment by looking in the skin and defaultSkin using the slot
     * index and attachment name. First the skin is checked and if the attachment was not found,
     * the default skin is checked.
     *
     * @method SpineGameObject#getAttachment
     * @since 3.19.0
     * 
     * @param {integer} slotIndex - The slot index to search.
     * @param {string} attachmentName - The attachment name to look for.
     *
     * @return {?spine.Attachment} The Attachment, if found. May be null.
     */
    getAttachment: function (slotIndex, attachmentName)
    {
        return this.skeleton.getAttachment(slotIndex, attachmentName);
    },

    /**
     * Finds an attachment by looking in the skin and defaultSkin using the slot name and attachment name.
     *
     * @method SpineGameObject#getAttachmentByName
     * @since 3.19.0
     * 
     * @param {string} slotName - The slot name to search.
     * @param {string} attachmentName - The attachment name to look for.
     *
     * @return {?spine.Attachment} The Attachment, if found. May be null.
     */
    getAttachmentByName: function (slotName, attachmentName)
    {
        return this.skeleton.getAttachmentByName(slotName, attachmentName);
    },

    /**
     * A convenience method to set an attachment by finding the slot with findSlot,
     * finding the attachment with getAttachment, then setting the slot's attachment.
     *
     * @method SpineGameObject#setAttachment
     * @since 3.19.0
     * 
     * @param {string} slotName - The slot name to add the attachment to.
     * @param {string} attachmentName - The attachment name to add.
     *
     * @return {this} This Game Object.
     */
    setAttachment: function (slotName, attachmentName)
    {
        if (Array.isArray(slotName) && Array.isArray(attachmentName) && slotName.length === attachmentName.length)
        {
            for (var i = 0; i < slotName.length; i++)
            {
                this.skeleton.setAttachment(slotName[i], attachmentName[i]);
            }
        }
        else
        {
            this.skeleton.setAttachment(slotName, attachmentName);
        }

        return this;
    },

    /**
     * Sets the bones, constraints, slots, and draw order to their setup pose values.
     *
     * @method SpineGameObject#setToSetupPose
     * @since 3.19.0
     *
     * @return {this} This Game Object.
     */
    setToSetupPose: function ()
    {
        this.skeleton.setToSetupPose();

        return this;
    },

    /**
     * Sets the slots and draw order to their setup pose values.
     *
     * @method SpineGameObject#setSlotsToSetupPose
     * @since 3.19.0
     *
     * @return {this} This Game Object.
     */
    setSlotsToSetupPose: function ()
    {
        this.skeleton.setSlotsToSetupPose();

        return this;
    },

    /**
     * Sets the bones and constraints to their setup pose values.
     *
     * @method SpineGameObject#setBonesToSetupPose
     * @since 3.19.0
     *
     * @return {this} This Game Object.
     */
    setBonesToSetupPose: function ()
    {
        this.skeleton.setBonesToSetupPose();

        return this;
    },

    /**
     * Gets the root bone, or null.
     *
     * @method SpineGameObject#getRootBone
     * @since 3.19.0
     *
     * @return {spine.Bone} The root bone, or null.
     */
    getRootBone: function ()
    {
        return this.skeleton.getRootBone();
    },

    /**
     * Takes a Bone object and a position in world space and rotates the Bone so it is angled
     * towards the given position. You can set an optional angle offset, should the bone be
     * designed at a specific angle already. You can also set a minimum and maximum range for the angle.
     *
     * @method SpineGameObject#angleBoneToXY
     * @since 3.19.0
     * 
     * @param {spine.Bone} bone - The bone to rotate towards the world position.
     * @param {number} worldX - The world x coordinate to rotate the bone towards.
     * @param {number} worldY - The world y coordinate to rotate the bone towards.
     * @param {number} [offset=0] - An offset to add to the rotation angle.
     * @param {number} [minAngle=0] - The minimum range of the rotation angle.
     * @param {number} [maxAngle=360] - The maximum range of the rotation angle.
     *
     * @return {this} This Game Object.
     */
    angleBoneToXY: function (bone, worldX, worldY, offset, minAngle, maxAngle)
    {
        if (offset === undefined) { offset = 0; }
        if (minAngle === undefined) { minAngle = 0; }
        if (maxAngle === undefined) { maxAngle = 360; }

        var renderer = this.plugin.renderer;
        var height = renderer.height;

        var angle = CounterClockwise(AngleBetween(bone.worldX, height - bone.worldY, worldX, worldY) + DegToRad(offset));

        bone.rotation = Clamp(RadToDeg(angle), minAngle, maxAngle);

        return this;
    },

    /**
     * Finds a bone by comparing each bone's name. It is more efficient to cache the results
     * of this method than to call it multiple times.
     *
     * @method SpineGameObject#findBone
     * @since 3.19.0
     * 
     * @param {string} boneName - The name of the bone to find.
     *
     * @return {spine.Bone} The bone, or null.
     */
    findBone: function (boneName)
    {
        return this.skeleton.findBone(boneName);
    },

    /**
     * Finds the index of a bone by comparing each bone's name. It is more efficient to cache the results
     * of this method than to call it multiple times.
     *
     * @method SpineGameObject#findBoneIndex
     * @since 3.19.0
     * 
     * @param {string} boneName - The name of the bone to find.
     *
     * @return {integer} The bone index. Or -1 if the bone was not found.
     */
    findBoneIndex: function (boneName)
    {
        return this.skeleton.findBoneIndex(boneName);
    },

    /**
     * Finds a slot by comparing each slot's name. It is more efficient to cache the results
     * of this method than to call it multiple times.
     *
     * @method SpineGameObject#findSlot
     * @since 3.19.0
     * 
     * @param {string} slotName - The name of the slot to find.
     *
     * @return {spine.Slot} The Slot. May be null.
     */
    findSlot: function (slotName)
    {
        return this.skeleton.findSlot(slotName);
    },

    /**
     * Finds the index of a slot by comparing each slot's name. It is more efficient to cache the results
     * of this method than to call it multiple times.
     *
     * @method SpineGameObject#findSlotIndex
     * @since 3.19.0
     * 
     * @param {string} slotName - The name of the slot to find.
     *
     * @return {integer} The slot index. Or -1 if the Slot was not found.
     */
    findSlotIndex: function (slotName)
    {
        return this.skeleton.findSlotIndex(slotName);
    },

    /**
     * Finds a skin by comparing each skin's name. It is more efficient to cache the results of
     * this method than to call it multiple times.
     *
     * @method SpineGameObject#findSkin
     * @since 3.19.0
     * 
     * @param {string} skinName - The name of the skin to find.
     *
     * @return {spine.Skin} The Skin. May be null.
     */
    findSkin: function (skinName)
    {
        return this.skeletonData.findSkin(skinName);
    },

    /**
     * Finds an event by comparing each events's name. It is more efficient to cache the results
     * of this method than to call it multiple times.
     *
     * @method SpineGameObject#findEvent
     * @since 3.19.0
     * 
     * @param {string} eventDataName - The name of the event to find.
     *
     * @return {spine.EventData} The Event Data. May be null.
     */
    findEvent: function (eventDataName)
    {
        return this.skeletonData.findEvent(eventDataName);
    },

    /**
     * Finds an animation by comparing each animation's name. It is more efficient to cache the results
     * of this method than to call it multiple times.
     *
     * @method SpineGameObject#findAnimation
     * @since 3.19.0
     * 
     * @param {string} animationName - The name of the animation to find.
     *
     * @return {spine.Animation} The Animation. May be null.
     */
    findAnimation: function (animationName)
    {
        return this.skeletonData.findAnimation(animationName);
    },

    /**
     * Finds an IK constraint by comparing each IK constraint's name. It is more efficient to cache the results
     * of this method than to call it multiple times.
     *
     * @method SpineGameObject#findIkConstraint
     * @since 3.19.0
     * 
     * @param {string} constraintName - The name of the constraint to find.
     *
     * @return {spine.IkConstraintData} The IK constraint. May be null.
     */
    findIkConstraint: function (constraintName)
    {
        return this.skeletonData.findIkConstraint(constraintName);
    },

    /**
     * Finds an transform constraint by comparing each transform constraint's name.
     * It is more efficient to cache the results of this method than to call it multiple times.
     *
     * @method SpineGameObject#findTransformConstraint
     * @since 3.19.0
     * 
     * @param {string} constraintName - The name of the constraint to find.
     *
     * @return {spine.TransformConstraintData} The transform constraint. May be null.
     */
    findTransformConstraint: function (constraintName)
    {
        return this.skeletonData.findTransformConstraint(constraintName);
    },

    /**
     * Finds a path constraint by comparing each path constraint's name.
     * It is more efficient to cache the results of this method than to call it multiple times.
     *
     * @method SpineGameObject#findPathConstraint
     * @since 3.19.0
     * 
     * @param {string} constraintName - The name of the constraint to find.
     *
     * @return {spine.PathConstraintData} The path constraint. May be null.
     */
    findPathConstraint: function (constraintName)
    {
        return this.skeletonData.findPathConstraint(constraintName);
    },

    /**
     * Finds the index of a path constraint by comparing each path constraint's name.
     * It is more efficient to cache the results of this method than to call it multiple times.
     *
     * @method SpineGameObject#findPathConstraintIndex
     * @since 3.19.0
     * 
     * @param {string} constraintName - The name of the constraint to find.
     *
     * @return {integer} The constraint index. Or -1 if the constraint was not found.
     */
    findPathConstraintIndex: function (constraintName)
    {
        return this.skeletonData.findPathConstraintIndex(constraintName);
    },

    /**
     * Returns the axis aligned bounding box (AABB) of the region and mesh attachments for the current pose.
     * 
     * The returned object contains two properties: `offset` and `size`:
     * 
     * `offset` - The distance from the skeleton origin to the bottom left corner of the AABB.
     * `size` - The width and height of the AABB.
     *
     * @method SpineGameObject#getBounds
     * @since 3.19.0
     * 
     * @return {any} The bounds object.
     */
    getBounds: function ()
    {
        return this.plugin.getBounds(this.skeleton);
    },

    /**
     * Internal update handler.
     *
     * @method SpineGameObject#preUpdate
     * @protected
     * @since 3.19.0
     * 
     * @param {number} time - The current timestamp.
     * @param {number} delta - The delta time, in ms, elapsed since the last frame.
     */
    preUpdate: function (time, delta)
    {
        var skeleton = this.skeleton;

        this.state.update((delta / 1000) * this.timeScale);

        this.state.apply(skeleton);
    },

    /**
     * Internal destroy handler, called as part of the destroy process.
     *
     * @method SpineGameObject#preDestroy
     * @protected
     * @since 3.19.0
     */
    preDestroy: function ()
    {
        if (this.state)
        {
            this.state.clearListeners();
            this.state.clearListenerNotifications();
        }

        this.plugin = null;

        this.skeleton = null;
        this.skeletonData = null;

        this.state = null;
        this.stateData = null;
    }

});

module.exports = SpineGameObject;
