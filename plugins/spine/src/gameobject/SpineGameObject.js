/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../../src/utils/Class');
var Clamp = require('../../../../src/math/Clamp');
var ComponentsComputedSize = require('../../../../src/gameobjects/components/ComputedSize');
var ComponentsDepth = require('../../../../src/gameobjects/components/Depth');
var ComponentsFlip = require('../../../../src/gameobjects/components/Flip');
var ComponentsScrollFactor = require('../../../../src/gameobjects/components/ScrollFactor');
var ComponentsTransform = require('../../../../src/gameobjects/components/Transform');
var ComponentsVisible = require('../../../../src/gameobjects/components/Visible');
var GameObject = require('../../../../src/gameobjects/GameObject');
var SpineGameObjectRender = require('./SpineGameObjectRender');
var AngleBetween = require('../../../../src/math/angle/Between');
var CounterClockwise = require('../../../../src/math/angle/CounterClockwise');
var DegToRad = require('../../../../src/math/DegToRad');
var RadToDeg = require('../../../../src/math/RadToDeg');

/**
 * @classdesc
 * TODO
 *
 * @class SpineGameObject
 * @constructor
 * @since 3.16.0
 *
 * @param {Phaser.Scene} scene - A reference to the Scene that has installed this plugin.
 * @param {Phaser.Plugins.PluginManager} pluginManager - A reference to the Phaser Plugin Manager.
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

        this.plugin = plugin;

        this.root = null;
        this.skeleton = null;
        this.skeletonData = null;

        this.state = null;
        this.stateData = null;

        this.bounds = null;
        
        this.drawDebug = false;

        this.timeScale = 1;

        this.displayOriginX = 0;
        this.displayOriginY = 0;

        this.preMultipliedAlpha = false;

        //  BlendMode Normal
        this.blendMode = 0;

        this.setPosition(x, y);

        if (key)
        {
            this.setSkeleton(key, animationName, loop);
        }
    },

    willRender: function ()
    {
        return true;
    },

    /**
     * Set the Alpha level of this Game Object. The alpha controls the opacity of the Game Object as it renders.
     * Alpha values are provided as a float between 0, fully transparent, and 1, fully opaque.
     *
     * If your game is running under WebGL you can optionally specify four different alpha values, each of which
     * correspond to the four corners of the Game Object. Under Canvas only the `topLeft` value given is used.
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
     * @since 3.0.0
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
     * The amount of red used when rendering the Skeletons.
     * 
     * A value between 0 and 1.
     *
     * This is a global value, impacting the entire Skeleton, not just a region of it.
     *
     * @name SpineGameObject#red
     * @type {number}
     * @since 3.0.0
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
     * The amount of green used when rendering the Skeletons.
     * 
     * A value between 0 and 1.
     *
     * This is a global value, impacting the entire Skeleton, not just a region of it.
     *
     * @name SpineGameObject#green
     * @type {number}
     * @since 3.0.0
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
     * The amount of blue used when rendering the Skeletons.
     * 
     * A value between 0 and 1.
     *
     * This is a global value, impacting the entire Skeleton, not just a region of it.
     *
     * @name SpineGameObject#blue
     * @type {number}
     * @since 3.0.0
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
     * Sets an additive tint on this Game Object.
     *
     * @method Phaser.GameObjects.Components.Tint#setColor
     * @webglOnly
     * @since 3.19.0
     *
     * @param {integer} [color=0xffffff] - The tint being applied to the top-left of the Game Object. If no other values are given this value is applied evenly, tinting the whole Game Object.
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

    setSkeletonFromJSON: function (atlasDataKey, skeletonJSON, animationName, loop)
    {
        return this.setSkeleton(atlasDataKey, skeletonJSON, animationName, loop);
    },

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

        skeleton.setSkinByName('default');
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

    setOffset: function (offsetX, offsetY)
    {
        var skeleton = this.skeleton;

        if (offsetX === undefined) { offsetX = 0; }
        if (offsetY === undefined) { offsetY = 0; }

        this.displayOriginX = skeleton.x - offsetX;
        this.displayOriginY = skeleton.y - offsetY;

        return this;
    },

    updateSize: function ()
    {
        var skeleton = this.skeleton;
        var renderer = this.scene.sys.renderer;

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

    getCurrentAnimation: function (trackIndex)
    {
        if (trackIndex === undefined) { trackIndex = 0; }

        var current = this.state.getCurrent(trackIndex);

        if (current)
        {
            return current.animation;
        }
    },

    play: function (animationName, loop)
    {
        if (loop === undefined) { loop = false; }

        return this.setAnimation(0, animationName, loop);
    },

    setAnimation: function (trackIndex, animationName, loop)
    {
        if (this.findAnimation(animationName))
        {
            this.state.setAnimation(trackIndex, animationName, loop);
        }

        return this;
    },

    addAnimation: function (trackIndex, animationName, loop, delay)
    {
        this.state.addAnimation(trackIndex, animationName, loop, delay);

        return this;
    },

    setEmptyAnimation: function (trackIndex, mixDuration)
    {
        this.state.setEmptyAnimation(trackIndex, mixDuration);

        return this;
    },

    clearTrack: function (trackIndex)
    {
        this.state.clearTrack(trackIndex);

        return this;
    },
     
    clearTracks: function ()
    {
        this.state.clearTracks();

        return this;
    },

    setSkinByName: function (skinName)
    {
        var skeleton = this.skeleton;

        skeleton.setSkinByName(skinName);

        skeleton.setSlotsToSetupPose();

        this.state.apply(skeleton);

        return this;
    },

    setSkin: function (newSkin)
    {
        var skeleton = this.skeleton;

        skeleton.setSkin(newSkin);

        skeleton.setSlotsToSetupPose();

        this.state.apply(skeleton);

        return this;
    },

    setMix: function (fromName, toName, duration)
    {
        this.stateData.setMix(fromName, toName, duration);

        return this;
    },

    getAttachment: function (slotIndex, attachmentName)
    {
        return this.skeleton.getAttachment(slotIndex, attachmentName);
    },

    getAttachmentByName: function (slotName, attachmentName)
    {
        return this.skeleton.getAttachmentByName(slotName, attachmentName);
    },

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

    setToSetupPose: function ()
    {
        this.skeleton.setToSetupPose();

        return this;
    },

    setSlotsToSetupPose: function ()
    {
        this.skeleton.setSlotsToSetupPose();

        return this;
    },

    setBonesToSetupPose: function ()
    {
        this.skeleton.setBonesToSetupPose();

        return this;
    },

    getRootBone: function ()
    {
        return this.skeleton.getRootBone();
    },

    angleBoneToXY: function (bone, worldX, worldY, offset, minAngle, maxAngle)
    {
        if (offset === undefined) { offset = 0; }
        if (minAngle === undefined) { minAngle = 0; }
        if (maxAngle === undefined) { maxAngle = 360; }

        var renderer = this.scene.sys.renderer;
        var height = renderer.height;

        var angle = CounterClockwise(AngleBetween(bone.worldX, height - bone.worldY, worldX, worldY) + DegToRad(offset));

        bone.rotation = Clamp(RadToDeg(angle), minAngle, maxAngle);

        return this;
    },

    findBone: function (boneName)
    {
        return this.skeleton.findBone(boneName);
    },

    findBoneIndex: function (boneName)
    {
        return this.skeleton.findBoneIndex(boneName);
    },

    findSlot: function (slotName)
    {
        return this.skeleton.findSlot(slotName);
    },

    findSlotIndex: function (slotName)
    {
        return this.skeleton.findSlotIndex(slotName);
    },

    findSkin: function (skinName)
    {
        return this.skeletonData.findSkin(skinName);
    },

    findEvent: function (eventDataName)
    {
        return this.skeletonData.findEvent(eventDataName);
    },

    findAnimation: function (animationName)
    {
        return this.skeletonData.findAnimation(animationName);
    },

    findIkConstraint: function (constraintName)
    {
        return this.skeletonData.findIkConstraint(constraintName);
    },

    findTransformConstraint: function (constraintName)
    {
        return this.skeletonData.findTransformConstraint(constraintName);
    },

    findPathConstraint: function (constraintName)
    {
        return this.skeletonData.findPathConstraint(constraintName);
    },

    findPathConstraintIndex: function (pathConstraintName)
    {
        return this.skeletonData.findPathConstraintIndex(pathConstraintName);
    },

    // getBounds (	2-tuple offset, 2-tuple size, float[] temp): void
    // Returns the axis aligned bounding box (AABB) of the region and mesh attachments for the current pose.
    // offset An output value, the distance from the skeleton origin to the bottom left corner of the AABB.
    // size An output value, the width and height of the AABB.

    getBounds: function ()
    {
        return this.plugin.getBounds(this.skeleton);
    },

    preUpdate: function (time, delta)
    {
        var skeleton = this.skeleton;

        this.state.update((delta / 1000) * this.timeScale);

        this.state.apply(skeleton);

        this.emit('spine.update', skeleton);
    },

    /**
     * Internal destroy handler, called as part of the destroy process.
     *
     * @method Phaser.GameObjects.RenderTexture#preDestroy
     * @protected
     * @since 3.16.0
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
