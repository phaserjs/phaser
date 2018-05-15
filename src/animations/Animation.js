/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Clamp = require('../math/Clamp');
var Class = require('../utils/Class');
var FindClosestInSorted = require('../utils/array/FindClosestInSorted');
var Frame = require('./AnimationFrame');
var GetValue = require('../utils/object/GetValue');

/**
 * @typedef {object} JSONAnimation
 *
 * @property {string} key - The key that the animation will be associated with. i.e. sprite.animations.play(key)
 * @property {string} type - A frame based animation (as opposed to a bone based animation)
 * @property {JSONAnimationFrame[]} frames - [description]
 * @property {integer} frameRate - The frame rate of playback in frames per second (default 24 if duration is null)
 * @property {integer} duration - How long the animation should play for in milliseconds. If not given its derived from frameRate.
 * @property {boolean} skipMissedFrames - Skip frames if the time lags, or always advanced anyway?
 * @property {integer} delay - Delay before starting playback. Value given in milliseconds.
 * @property {integer} repeat - Number of times to repeat the animation (-1 for infinity)
 * @property {integer} repeatDelay - Delay before the animation repeats. Value given in milliseconds.
 * @property {boolean} yoyo - Should the animation yoyo? (reverse back down to the start) before repeating?
 * @property {boolean} showOnStart - Should sprite.visible = true when the animation starts to play?
 * @property {boolean} hideOnComplete - Should sprite.visible = false when the animation finishes?
 */

/**
 * @typedef {object} AnimationFrameConfig
 *
 * @property {string} key - The key that the animation will be associated with. i.e. sprite.animations.play(key)
 * @property {(string|number)} frame - [description]
 * @property {float} [duration=0] - [description]
 * @property {boolean} [visible] - [description]
 */

/**
 * @typedef {object} AnimationConfig
 *
 * @property {string} [key] - The key that the animation will be associated with. i.e. sprite.animations.play(key)
 * @property {AnimationFrameConfig[]} [frames] - An object containing data used to generate the frames for the animation
 * @property {string} [defaultTextureKey=null] - The key of the texture all frames of the animation will use. Can be overridden on a per frame basis.
 * @property {integer} [frameRate] - The frame rate of playback in frames per second (default 24 if duration is null)
 * @property {integer} [duration] - How long the animation should play for in milliseconds. If not given its derived from frameRate.
 * @property {boolean} [skipMissedFrames=true] - Skip frames if the time lags, or always advanced anyway?
 * @property {integer} [delay=0] - Delay before starting playback. Value given in milliseconds.
 * @property {integer} [repeat=0] - Number of times to repeat the animation (-1 for infinity)
 * @property {integer} [repeatDelay=0] - Delay before the animation repeats. Value given in milliseconds.
 * @property {boolean} [yoyo=false] - Should the animation yoyo? (reverse back down to the start) before repeating?
 * @property {boolean} [showOnStart=false] - Should sprite.visible = true when the animation starts to play?
 * @property {boolean} [hideOnComplete=false] - Should sprite.visible = false when the animation finishes?
 */

/**
 * @classdesc
 * A Frame based Animation.
 *
 * This consists of a key, some default values (like the frame rate) and a bunch of Frame objects.
 *
 * The Animation Manager creates these. Game Objects don't own an instance of these directly.
 * Game Objects have the Animation Component, which are like playheads to global Animations (these objects)
 * So multiple Game Objects can have playheads all pointing to this one Animation instance.
 *
 * @class Animation
 * @memberOf Phaser.Animations
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Animations.AnimationManager} manager - [description]
 * @param {string} key - [description]
 * @param {AnimationConfig} config - [description]
 */
var Animation = new Class({

    initialize:

    function Animation (manager, key, config)
    {
        /**
         * A reference to the global Animation Manager
         *
         * @name Phaser.Animations.Animation#manager
         * @type {Phaser.Animations.AnimationManager}
         * @since 3.0.0
         */
        this.manager = manager;

        /**
         * The unique identifying string for this animation
         *
         * @name Phaser.Animations.Animation#key
         * @type {string}
         * @since 3.0.0
         */
        this.key = key;

        /**
         * A frame based animation (as opposed to a bone based animation)
         *
         * @name Phaser.Animations.Animation#type
         * @type {string}
         * @default frame
         * @since 3.0.0
         */
        this.type = 'frame';

        /**
         * Extract all the frame data into the frames array
         *
         * @name Phaser.Animations.Animation#frames
         * @type {Phaser.Animations.AnimationFrame[]}
         * @since 3.0.0
         */
        this.frames = this.getFrames(
            manager.textureManager,
            GetValue(config, 'frames', []),
            GetValue(config, 'defaultTextureKey', null)
        );

        /**
         * The frame rate of playback in frames per second (default 24 if duration is null)
         *
         * @name Phaser.Animations.Animation#frameRate
         * @type {integer}
         * @default 24
         * @since 3.0.0
         */
        this.frameRate = GetValue(config, 'frameRate', null);

        /**
         * How long the animation should play for, in milliseconds.
         * If the `frameRate` property has been set then it overrides this value,
         * otherwise the `frameRate` is derived from `duration`.
         *
         * @name Phaser.Animations.Animation#duration
         * @type {integer}
         * @since 3.0.0
         */
        this.duration = GetValue(config, 'duration', null);

        if (this.duration === null && this.frameRate === null)
        {
            //  No duration or frameRate given, use default frameRate of 24fps
            this.frameRate = 24;
            this.duration = (this.frameRate / this.frames.length) * 1000;
        }
        else if (this.duration && this.frameRate === null)
        {
            //  Duration given but no frameRate, so set the frameRate based on duration
            //  I.e. 12 frames in the animation, duration = 4000 ms
            //  So frameRate is 12 / (4000 / 1000) = 3 fps
            this.frameRate = this.frames.length / (this.duration / 1000);
        }
        else
        {
            //  frameRate given, derive duration from it (even if duration also specified)
            //  I.e. 15 frames in the animation, frameRate = 30 fps
            //  So duration is 15 / 30 = 0.5 * 1000 (half a second, or 500ms)
            this.duration = (this.frames.length / this.frameRate) * 1000;
        }

        /**
         * How many ms per frame, not including frame specific modifiers.
         *
         * @name Phaser.Animations.Animation#msPerFrame
         * @type {integer}
         * @since 3.0.0
         */
        this.msPerFrame = 1000 / this.frameRate;

        /**
         * Skip frames if the time lags, or always advanced anyway?
         *
         * @name Phaser.Animations.Animation#skipMissedFrames
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.skipMissedFrames = GetValue(config, 'skipMissedFrames', true);

        /**
         * The delay in ms before the playback will begin.
         *
         * @name Phaser.Animations.Animation#delay
         * @type {integer}
         * @default 0
         * @since 3.0.0
         */
        this.delay = GetValue(config, 'delay', 0);

        /**
         * Number of times to repeat the animation. Set to -1 to repeat forever.
         *
         * @name Phaser.Animations.Animation#repeat
         * @type {integer}
         * @default 0
         * @since 3.0.0
         */
        this.repeat = GetValue(config, 'repeat', 0);

        /**
         * The delay in ms before the a repeat playthrough starts.
         *
         * @name Phaser.Animations.Animation#repeatDelay
         * @type {integer}
         * @default 0
         * @since 3.0.0
         */
        this.repeatDelay = GetValue(config, 'repeatDelay', 0);

        /**
         * Should the animation yoyo? (reverse back down to the start) before repeating?
         *
         * @name Phaser.Animations.Animation#yoyo
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.yoyo = GetValue(config, 'yoyo', false);

        /**
         * Should sprite.visible = true when the animation starts to play?
         *
         * @name Phaser.Animations.Animation#showOnStart
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.showOnStart = GetValue(config, 'showOnStart', false);

        /**
         * Should sprite.visible = false when the animation finishes?
         *
         * @name Phaser.Animations.Animation#hideOnComplete
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.hideOnComplete = GetValue(config, 'hideOnComplete', false);

        /**
         * Global pause. All Game Objects using this Animation instance are impacted by this property.
         *
         * @name Phaser.Animations.Animation#paused
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.paused = false;

        this.manager.on('pauseall', this.pause, this);
        this.manager.on('resumeall', this.resume, this);
    },

    /**
     * Add frames to the end of the animation.
     *
     * @method Phaser.Animations.Animation#addFrame
     * @since 3.0.0
     *
     * @param {(string|AnimationFrameConfig[])} config - [description]
     *
     * @return {Phaser.Animations.Animation} This Animation object.
     */
    addFrame: function (config)
    {
        return this.addFrameAt(this.frames.length, config);
    },

    /**
     * Add frame/s into the animation.
     *
     * @method Phaser.Animations.Animation#addFrameAt
     * @since 3.0.0
     *
     * @param {integer} index - [description]
     * @param {(string|AnimationFrameConfig[])} config - [description]
     *
     * @return {Phaser.Animations.Animation} This Animation object.
     */
    addFrameAt: function (index, config)
    {
        var newFrames = this.getFrames(this.manager.textureManager, config);

        if (newFrames.length > 0)
        {
            if (index === 0)
            {
                this.frames = newFrames.concat(this.frames);
            }
            else if (index === this.frames.length)
            {
                this.frames = this.frames.concat(newFrames);
            }
            else
            {
                var pre = this.frames.slice(0, index);
                var post = this.frames.slice(index);

                this.frames = pre.concat(newFrames, post);
            }

            this.updateFrameSequence();
        }

        return this;
    },

    /**
     * Check if the given frame index is valid.
     *
     * @method Phaser.Animations.Animation#checkFrame
     * @since 3.0.0
     *
     * @param {integer} index - The index to be checked.
     *
     * @return {boolean} `true` if the index is valid, otherwise `false`.
     */
    checkFrame: function (index)
    {
        return (index >= 0 && index < this.frames.length);
    },

    /**
     * [description]
     *
     * @method Phaser.Animations.Animation#completeAnimation
     * @protected
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Components.Animation} component - [description]
     */
    completeAnimation: function (component)
    {
        if (this.hideOnComplete)
        {
            component.parent.visible = false;
        }

        component.stop();
    },

    /**
     * [description]
     *
     * @method Phaser.Animations.Animation#getFirstTick
     * @protected
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Components.Animation} component - [description]
     * @param {boolean} [includeDelay=true] - [description]
     */
    getFirstTick: function (component, includeDelay)
    {
        if (includeDelay === undefined) { includeDelay = true; }

        //  When is the first update due?
        component.accumulator = 0;
        component.nextTick = component.msPerFrame + component.currentFrame.duration;

        if (includeDelay)
        {
            component.nextTick += component._delay;
        }
    },

    /**
     * Returns the AnimationFrame at the provided index
     *
     * @method Phaser.Animations.Animation#getFrameAt
     * @protected
     * @since 3.0.0
     *
     * @param {integer} index - The index in the AnimationFrame array
     *
     * @return {Phaser.Animations.AnimationFrame} The frame at the index provided from the animation sequence
     */
    getFrameAt: function (index)
    {
        return this.frames[index];
    },

    /**
     * [description]
     *
     * @method Phaser.Animations.Animation#getFrames
     * @since 3.0.0
     *
     * @param {Phaser.Textures.TextureManager} textureManager - [description]
     * @param {(string|AnimationFrameConfig[])} frames - [description]
     * @param {string} [defaultTextureKey] - [description]
     *
     * @return {Phaser.Animations.AnimationFrame[]} [description]
     */
    getFrames: function (textureManager, frames, defaultTextureKey)
    {
        var out = [];
        var prev;
        var animationFrame;
        var index = 1;
        var i;
        var textureKey;

        //  if frames is a string, we'll get all the frames from the texture manager as if it's a sprite sheet
        if (typeof frames === 'string')
        {
            textureKey = frames;

            var texture = textureManager.get(textureKey);
            var frameKeys = texture.getFrameNames();

            frames = [];

            frameKeys.forEach(function (idx, value)
            {
                frames.push({ key: textureKey, frame: value });
            });
        }

        if (!Array.isArray(frames) || frames.length === 0)
        {
            return out;
        }

        for (i = 0; i < frames.length; i++)
        {
            var item = frames[i];

            var key = GetValue(item, 'key', defaultTextureKey);

            if (!key)
            {
                continue;
            }

            //  Could be an integer or a string
            var frame = GetValue(item, 'frame', 0);

            //  The actual texture frame
            var textureFrame = textureManager.getFrame(key, frame);

            animationFrame = new Frame(key, frame, index, textureFrame);

            animationFrame.duration = GetValue(item, 'duration', 0);

            animationFrame.isFirst = (!prev);

            //  The previously created animationFrame
            if (prev)
            {
                prev.nextFrame = animationFrame;

                animationFrame.prevFrame = prev;
            }

            out.push(animationFrame);

            prev = animationFrame;

            index++;
        }

        if (out.length > 0)
        {
            animationFrame.isLast = true;

            //  Link them end-to-end, so they loop
            animationFrame.nextFrame = out[0];

            out[0].prevFrame = animationFrame;

            //  Generate the progress data

            var slice = 1 / (out.length - 1);

            for (i = 0; i < out.length; i++)
            {
                out[i].progress = i * slice;
            }
        }

        return out;
    },

    /**
     * [description]
     *
     * @method Phaser.Animations.Animation#getNextTick
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Components.Animation} component - [description]
     */
    getNextTick: function (component)
    {
        // accumulator += delta * _timeScale
        // after a large delta surge (perf issue for example) we need to adjust for it here

        //  When is the next update due?
        component.accumulator -= component.nextTick;

        component.nextTick = component.msPerFrame + component.currentFrame.duration;
    },

    /**
     * Loads the Animation values into the Animation Component.
     *
     * @method Phaser.Animations.Animation#load
     * @private
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Components.Animation} component - [description]
     * @param {integer} startFrame - [description]
     */
    load: function (component, startFrame)
    {
        if (startFrame >= this.frames.length)
        {
            startFrame = 0;
        }

        if (component.currentAnim !== this)
        {
            component.currentAnim = this;

            component.frameRate = this.frameRate;
            component.duration = this.duration;
            component.msPerFrame = this.msPerFrame;
            component.skipMissedFrames = this.skipMissedFrames;

            component._timeScale = 1;
            component._delay = this.delay;
            component._repeat = this.repeat;
            component._repeatDelay = this.repeatDelay;
            component._yoyo = this.yoyo;
        }

        component.updateFrame(this.frames[startFrame]);
    },

    /**
     * Returns the frame closest to the given progress value between 0 and 1.
     *
     * @method Phaser.Animations.Animation#getFrameByProgress
     * @since 3.4.0
     *
     * @param {float} value - A value between 0 and 1.
     *
     * @return {Phaser.Animations.AnimationFrame} [description]
     */
    getFrameByProgress: function (value)
    {
        value = Clamp(value, 0, 1);

        return FindClosestInSorted(value, this.frames, 'progress');
    },

    /**
     * [description]
     *
     * @method Phaser.Animations.Animation#nextFrame
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Components.Animation} component - [description]
     */
    nextFrame: function (component)
    {
        var frame = component.currentFrame;

        //  TODO: Add frame skip support

        if (frame.isLast)
        {
            //  We're at the end of the animation

            //  Yoyo? (happens before repeat)
            if (component._yoyo)
            {
                component.forward = false;

                component.updateFrame(frame.prevFrame);

                //  Delay for the current frame
                this.getNextTick(component);
            }
            else if (component.repeatCounter > 0)
            {
                //  Repeat (happens before complete)
                this.repeatAnimation(component);
            }
            else
            {
                this.completeAnimation(component);
            }
        }
        else
        {
            component.updateFrame(frame.nextFrame);

            this.getNextTick(component);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Animations.Animation#previousFrame
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Components.Animation} component - [description]
     */
    previousFrame: function (component)
    {
        var frame = component.currentFrame;

        //  TODO: Add frame skip support

        if (frame.isFirst)
        {
            //  We're at the start of the animation

            if (component.repeatCounter > 0)
            {
                //  Repeat (happens before complete)
                this.repeatAnimation(component);
            }
            else
            {
                this.completeAnimation(component);
            }
        }
        else
        {
            component.updateFrame(frame.prevFrame);

            this.getNextTick(component);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Animations.Animation#removeFrame
     * @since 3.0.0
     *
     * @param {Phaser.Animations.AnimationFrame} frame - [description]
     *
     * @return {Phaser.Animations.Animation} This Animation object.
     */
    removeFrame: function (frame)
    {
        var index = this.frames.indexOf(frame);

        if (index !== -1)
        {
            this.removeFrameAt(index);
        }

        return this;
    },

    /**
     * Removes a frame from the AnimationFrame array at the provided index
     * and updates the animation accordingly.
     *
     * @method Phaser.Animations.Animation#removeFrameAt
     * @since 3.0.0
     *
     * @param {integer} index - The index in the AnimationFrame array
     *
     * @return {Phaser.Animations.Animation} This Animation object.
     */
    removeFrameAt: function (index)
    {
        this.frames.splice(index, 1);

        this.updateFrameSequence();

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Animations.Animation#repeatAnimation
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Components.Animation} component - [description]
     */
    repeatAnimation: function (component)
    {
        if (component._pendingStop === 2)
        {
            return this.completeAnimation(component);
        }

        if (component._repeatDelay > 0 && component.pendingRepeat === false)
        {
            component.pendingRepeat = true;
            component.accumulator -= component.nextTick;
            component.nextTick += component._repeatDelay;
        }
        else
        {
            component.repeatCounter--;

            component.forward = true;

            component.updateFrame(component.currentFrame.nextFrame);

            if (component.isPlaying)
            {
                this.getNextTick(component);

                component.pendingRepeat = false;

                component.parent.emit('animationrepeat', this, component.currentFrame, component.repeatCounter);
            }
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Animations.Animation#setFrame
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Components.Animation} component - [description]
     */
    setFrame: function (component)
    {
        //  Work out which frame should be set next on the child, and set it
        if (component.forward)
        {
            this.nextFrame(component);
        }
        else
        {
            this.previousFrame(component);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Animations.Animation#toJSON
     * @since 3.0.0
     *
     * @return {JSONAnimation} [description]
     */
    toJSON: function ()
    {
        var output = {
            key: this.key,
            type: this.type,
            frames: [],
            frameRate: this.frameRate,
            duration: this.duration,
            skipMissedFrames: this.skipMissedFrames,
            delay: this.delay,
            repeat: this.repeat,
            repeatDelay: this.repeatDelay,
            yoyo: this.yoyo,
            showOnStart: this.showOnStart,
            hideOnComplete: this.hideOnComplete
        };

        this.frames.forEach(function (frame)
        {
            output.frames.push(frame.toJSON());
        });

        return output;
    },

    /**
     * [description]
     *
     * @method Phaser.Animations.Animation#updateFrameSequence
     * @since 3.0.0
     *
     * @return {Phaser.Animations.Animation} This Animation object.
     */
    updateFrameSequence: function ()
    {
        var len = this.frames.length;
        var slice = 1 / (len - 1);

        for (var i = 0; i < len; i++)
        {
            var frame = this.frames[i];

            frame.index = i + 1;
            frame.isFirst = false;
            frame.isLast = false;
            frame.progress = i * slice;

            if (i === 0)
            {
                frame.isFirst = true;
                frame.isLast = (len === 1);
                frame.prevFrame = this.frames[len - 1];
                frame.nextFrame = this.frames[i + 1];
            }
            else if (i === len - 1)
            {
                frame.isLast = true;
                frame.prevFrame = this.frames[len - 2];
                frame.nextFrame = this.frames[0];
            }
            else if (len > 1)
            {
                frame.prevFrame = this.frames[i - 1];
                frame.nextFrame = this.frames[i + 1];
            }
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Animations.Animation#pause
     * @since 3.0.0
     *
     * @return {Phaser.Animations.Animation} This Animation object.
     */
    pause: function ()
    {
        this.paused = true;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Animations.Animation#resume
     * @since 3.0.0
     *
     * @return {Phaser.Animations.Animation} This Animation object.
     */
    resume: function ()
    {
        this.paused = false;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Animations.Animation#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.manager.off('pauseall', this.pause, this);
        this.manager.off('resumeall', this.resume, this);

        this.manager.remove(this.key);

        for (var i = 0; i < this.frames.length; i++)
        {
            this.frames[i].destroy();
        }

        this.frames = [];

        this.manager = null;
    }

});

module.exports = Animation;
