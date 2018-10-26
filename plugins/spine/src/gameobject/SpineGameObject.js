/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../../src/utils/Class');
var ComponentsAlpha = require('../../../../src/gameobjects/components/Alpha');
var ComponentsBlendMode = require('../../../../src/gameobjects/components/BlendMode');
var ComponentsDepth = require('../../../../src/gameobjects/components/Depth');
var ComponentsFlip = require('../../../../src/gameobjects/components/Flip');
var ComponentsScrollFactor = require('../../../../src/gameobjects/components/ScrollFactor');
var ComponentsTransform = require('../../../../src/gameobjects/components/Transform');
var ComponentsVisible = require('../../../../src/gameobjects/components/Visible');
var GameObject = require('../../../../src/gameobjects/GameObject');
var SpineGameObjectRender = require('./SpineGameObjectRender');

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
        ComponentsAlpha,
        ComponentsBlendMode,
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

        this.runtime = plugin.getRuntime();

        this.skeleton = null;
        this.skeletonData = null;

        this.state = null;
        this.stateData = null;

        this.drawDebug = false;

        this.timeScale = 1;

        this.setPosition(x, y);

        if (key)
        {
            this.setSkeleton(key, animationName, loop);
        }
    },

    setSkeletonFromJSON: function (atlasDataKey, skeletonJSON, animationName, loop)
    {
        return this.setSkeleton(atlasDataKey, skeletonJSON, animationName, loop);
    },

    setSkeleton: function (atlasDataKey, animationName, loop, skeletonJSON)
    {
        var data = this.plugin.createSkeleton(atlasDataKey, skeletonJSON);

        this.skeletonData = data.skeletonData;

        var skeleton = data.skeleton;

        skeleton.flipY = (this.scene.sys.game.config.renderType === 1);

        skeleton.setToSetupPose();

        skeleton.updateWorldTransform();

        skeleton.setSkinByName('default');

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

        var _this = this;

        this.state.addListener({
            event: function (trackIndex, event)
            {
                //  Event on a Track
                _this.emit('spine.event', _this, trackIndex, event);
            },
            complete: function (trackIndex, loopCount)
            {
                //  Animation on Track x completed, loop count
                _this.emit('spine.complete', _this, trackIndex, loopCount);
            },
            start: function (trackIndex)
            {
                //  Animation on Track x started
                _this.emit('spine.start', _this, trackIndex);
            },
            end: function (trackIndex)
            {
                //  Animation on Track x ended
                _this.emit('spine.end', _this, trackIndex);
            }
        });

        if (animationName)
        {
            this.setAnimation(0, animationName, loop);
        }

        return this;
    },

    // http://esotericsoftware.com/spine-runtimes-guide

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

    play: function (animationName, loop)
    {
        if (loop === undefined)
        {
            loop = false;
        }

        return this.setAnimation(0, animationName, loop);
    },

    setAnimation: function (trackIndex, animationName, loop)
    {
        this.state.setAnimation(trackIndex, animationName, loop);

        return this;
    },

    addAnimation: function (trackIndex, animationName, loop, delay)
    {
        return this.state.addAnimation(trackIndex, animationName, loop, delay);
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
        this.skeleton.setSkinByName(skinName);

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

    getBounds: function ()
    {
        return this.plugin.getBounds(this.skeleton);
    },

    preUpdate: function (time, delta)
    {
        var skeleton = this.skeleton;

        skeleton.flipX = this.flipX;
        skeleton.flipY = this.flipY;

        this.state.update((delta / 1000) * this.timeScale);

        this.state.apply(skeleton);

        this.emit('spine.update', skeleton);

        skeleton.updateWorldTransform();
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
        this.runtime = null;

        this.skeleton = null;
        this.skeletonData = null;

        this.state = null;
        this.stateData = null;
    }

});

module.exports = SpineGameObject;
