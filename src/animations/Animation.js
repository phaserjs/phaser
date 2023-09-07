/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Clamp = require('../math/Clamp');
var Class = require('../utils/Class');
var Events = require('./events');
var FindClosestInSorted = require('../utils/array/FindClosestInSorted');
var Frame = require('./AnimationFrame');
var GetValue = require('../utils/object/GetValue');
var SortByDigits = require('../utils/array/SortByDigits');

/**
 * @classdesc
 * A Frame based Animation.
 *
 * Animations in Phaser consist of a sequence of `AnimationFrame` objects, which are managed by
 * this class, along with properties that impact playback, such as the animations frame rate
 * or delay.
 *
 * This class contains all of the properties and methods needed to handle playback of the animation
 * directly to an `AnimationState` instance, which is owned by a Sprite, or similar Game Object.
 *
 * You don't typically create an instance of this class directly, but instead go via
 * either the `AnimationManager` or the `AnimationState` and use their `create` methods,
 * depending on if you need a global animation, or local to a specific Sprite.
 *
 * @class Animation
 * @memberof Phaser.Animations
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Animations.AnimationManager} manager - A reference to the global Animation Manager
 * @param {string} key - The unique identifying string for this animation.
 * @param {Phaser.Types.Animations.Animation} config - The Animation configuration.
 */
var Animation = new Class({

    initialize:

    function Animation (manager, key, config)
    {
        /**
         * A reference to the global Animation Manager.
         *
         * @name Phaser.Animations.Animation#manager
         * @type {Phaser.Animations.AnimationManager}
         * @since 3.0.0
         */
        this.manager = manager;

        /**
         * The unique identifying string for this animation.
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
         * Extract all the frame data into the frames array.
         *
         * @name Phaser.Animations.Animation#frames
         * @type {Phaser.Animations.AnimationFrame[]}
         * @since 3.0.0
         */
        this.frames = this.getFrames(
            manager.textureManager,
            GetValue(config, 'frames', []),
            GetValue(config, 'defaultTextureKey', null),
            GetValue(config, 'sortFrames', true)
        );

        /**
         * The frame rate of playback in frames per second (default 24 if duration is null)
         *
         * @name Phaser.Animations.Animation#frameRate
         * @type {number}
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
         * @type {number}
         * @since 3.0.0
         */
        this.duration = GetValue(config, 'duration', null);

        /**
         * How many ms per frame, not including frame specific modifiers.
         *
         * @name Phaser.Animations.Animation#msPerFrame
         * @type {number}
         * @since 3.0.0
         */
        this.msPerFrame;

        /**
         * Skip frames if the time lags, or always advanced anyway?
         *
         * @name Phaser.Animations.Animation#skipMissedFrames
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.skipMissedFrames = GetValue(config, 'skipMissedFrames', true);

        /**
         * The delay in ms before the playback will begin.
         *
         * @name Phaser.Animations.Animation#delay
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.delay = GetValue(config, 'delay', 0);

        /**
         * Number of times to repeat the animation. Set to -1 to repeat forever.
         *
         * @name Phaser.Animations.Animation#repeat
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.repeat = GetValue(config, 'repeat', 0);

        /**
         * The delay in ms before the a repeat play starts.
         *
         * @name Phaser.Animations.Animation#repeatDelay
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.repeatDelay = GetValue(config, 'repeatDelay', 0);

        /**
         * Should the animation yoyo (reverse back down to the start) before repeating?
         *
         * @name Phaser.Animations.Animation#yoyo
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.yoyo = GetValue(config, 'yoyo', false);

        /**
         * If the animation has a delay set, before playback will begin, this
         * controls when the first frame is set on the Sprite. If this property
         * is 'false' then the frame is set only after the delay has expired.
         * This is the default behavior.
         *
         * @name Phaser.Animations.Animation#showBeforeDelay
         * @type {boolean}
         * @default false
         * @since 3.60.0
         */
        this.showBeforeDelay = GetValue(config, 'showBeforeDelay', false);

        /**
         * Should the GameObject's `visible` property be set to `true` when the animation starts to play?
         *
         * @name Phaser.Animations.Animation#showOnStart
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.showOnStart = GetValue(config, 'showOnStart', false);

        /**
         * Should the GameObject's `visible` property be set to `false` when the animation finishes?
         *
         * @name Phaser.Animations.Animation#hideOnComplete
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.hideOnComplete = GetValue(config, 'hideOnComplete', false);

        /**
         * Start playback of this animation from a random frame?
         *
         * @name Phaser.Animations.Animation#randomFrame
         * @type {boolean}
         * @default false
         * @since 3.60.0
         */
        this.randomFrame = GetValue(config, 'randomFrame', false);

        /**
         * Global pause. All Game Objects using this Animation instance are impacted by this property.
         *
         * @name Phaser.Animations.Animation#paused
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.paused = false;

        this.calculateDuration(this, this.getTotalFrames(), this.duration, this.frameRate);

        if (this.manager.on)
        {
            this.manager.on(Events.PAUSE_ALL, this.pause, this);
            this.manager.on(Events.RESUME_ALL, this.resume, this);
        }
    },

    /**
     * Gets the total number of frames in this animation.
     *
     * @method Phaser.Animations.Animation#getTotalFrames
     * @since 3.50.0
     *
     * @return {number} The total number of frames in this animation.
     */
    getTotalFrames: function ()
    {
        return this.frames.length;
    },

    /**
     * Calculates the duration, frame rate and msPerFrame values.
     *
     * @method Phaser.Animations.Animation#calculateDuration
     * @since 3.50.0
     *
     * @param {Phaser.Animations.Animation} target - The target to set the values on.
     * @param {number} totalFrames - The total number of frames in the animation.
     * @param {?number} [duration] - The duration to calculate the frame rate from. Pass `null` if you wish to set the `frameRate` instead.
     * @param {?number} [frameRate] - The frame rate to calculate the duration from.
     */
    calculateDuration: function (target, totalFrames, duration, frameRate)
    {
        if (duration === null && frameRate === null)
        {
            //  No duration or frameRate given, use default frameRate of 24fps
            target.frameRate = 24;
            target.duration = (24 / totalFrames) * 1000;
        }
        else if (duration && frameRate === null)
        {
            //  Duration given but no frameRate, so set the frameRate based on duration
            //  I.e. 12 frames in the animation, duration = 4000 ms
            //  So frameRate is 12 / (4000 / 1000) = 3 fps
            target.duration = duration;
            target.frameRate = totalFrames / (duration / 1000);
        }
        else
        {
            //  frameRate given, derive duration from it (even if duration also specified)
            //  I.e. 15 frames in the animation, frameRate = 30 fps
            //  So duration is 15 / 30 = 0.5 * 1000 (half a second, or 500ms)
            target.frameRate = frameRate;
            target.duration = (totalFrames / frameRate) * 1000;
        }

        target.msPerFrame = 1000 / target.frameRate;
    },

    /**
     * Add frames to the end of the animation.
     *
     * @method Phaser.Animations.Animation#addFrame
     * @since 3.0.0
     *
     * @param {(string|Phaser.Types.Animations.AnimationFrame[])} config - Either a string, in which case it will use all frames from a texture with the matching key, or an array of Animation Frame configuration objects.
     *
     * @return {this} This Animation object.
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
     * @param {number} index - The index to insert the frame at within the animation.
     * @param {(string|Phaser.Types.Animations.AnimationFrame[])} config - Either a string, in which case it will use all frames from a texture with the matching key, or an array of Animation Frame configuration objects.
     *
     * @return {this} This Animation object.
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
     * @param {number} index - The index to be checked.
     *
     * @return {boolean} `true` if the index is valid, otherwise `false`.
     */
    checkFrame: function (index)
    {
        return (index >= 0 && index < this.frames.length);
    },

    /**
     * Called internally when this Animation first starts to play.
     * Sets the accumulator and nextTick properties.
     *
     * @method Phaser.Animations.Animation#getFirstTick
     * @protected
     * @since 3.0.0
     *
     * @param {Phaser.Animations.AnimationState} state - The Animation State belonging to the Game Object invoking this call.
     */
    getFirstTick: function (state)
    {
        //  When is the first update due?
        state.accumulator = 0;

        state.nextTick = state.msPerFrame + state.currentFrame.duration;
    },

    /**
     * Returns the AnimationFrame at the provided index
     *
     * @method Phaser.Animations.Animation#getFrameAt
     * @since 3.0.0
     *
     * @param {number} index - The index in the AnimationFrame array
     *
     * @return {Phaser.Animations.AnimationFrame} The frame at the index provided from the animation sequence
     */
    getFrameAt: function (index)
    {
        return this.frames[index];
    },

    /**
     * Creates AnimationFrame instances based on the given frame data.
     *
     * @method Phaser.Animations.Animation#getFrames
     * @since 3.0.0
     *
     * @param {Phaser.Textures.TextureManager} textureManager - A reference to the global Texture Manager.
     * @param {(string|Phaser.Types.Animations.AnimationFrame[])} frames - Either a string, in which case it will use all frames from a texture with the matching key, or an array of Animation Frame configuration objects.
     * @param {string} [defaultTextureKey] - The key to use if no key is set in the frame configuration object.
     *
     * @return {Phaser.Animations.AnimationFrame[]} An array of newly created AnimationFrame instances.
     */
    getFrames: function (textureManager, frames, defaultTextureKey, sortFrames)
    {
        if (sortFrames === undefined) { sortFrames = true; }

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

            if (!textureManager.exists(textureKey))
            {
                console.warn('Texture "%s" not found', textureKey);

                return out;
            }

            var texture = textureManager.get(textureKey);
            var frameKeys = texture.getFrameNames();

            if (sortFrames)
            {
                SortByDigits(frameKeys);
            }

            frames = [];

            frameKeys.forEach(function (value)
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

            if (!textureFrame)
            {
                console.warn('Texture "%s" not found', key);

                continue;
            }

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
     * Called internally. Sets the accumulator and nextTick values of the current Animation.
     *
     * @method Phaser.Animations.Animation#getNextTick
     * @since 3.0.0
     *
     * @param {Phaser.Animations.AnimationState} state - The Animation State belonging to the Game Object invoking this call.
     */
    getNextTick: function (state)
    {
        state.accumulator -= state.nextTick;

        state.nextTick = state.msPerFrame + state.currentFrame.duration;
    },

    /**
     * Returns the frame closest to the given progress value between 0 and 1.
     *
     * @method Phaser.Animations.Animation#getFrameByProgress
     * @since 3.4.0
     *
     * @param {number} value - A value between 0 and 1.
     *
     * @return {Phaser.Animations.AnimationFrame} The frame closest to the given progress value.
     */
    getFrameByProgress: function (value)
    {
        value = Clamp(value, 0, 1);

        return FindClosestInSorted(value, this.frames, 'progress');
    },

    /**
     * Advance the animation frame.
     *
     * @method Phaser.Animations.Animation#nextFrame
     * @since 3.0.0
     *
     * @param {Phaser.Animations.AnimationState} state - The Animation State to advance.
     */
    nextFrame: function (state)
    {
        var frame = state.currentFrame;

        if (frame.isLast)
        {
            //  We're at the end of the animation

            //  Yoyo? (happens before repeat)
            if (state.yoyo)
            {
                this.handleYoyoFrame(state, false);
            }
            else if (state.repeatCounter > 0)
            {
                //  Repeat (happens before complete)

                if (state.inReverse && state.forward)
                {
                    state.forward = false;
                }
                else
                {
                    this.repeatAnimation(state);
                }
            }
            else
            {
                state.complete();
            }
        }
        else
        {
            this.updateAndGetNextTick(state, frame.nextFrame);
        }
    },

    /**
     * Handle the yoyo functionality in nextFrame and previousFrame methods.
     *
     * @method Phaser.Animations.Animation#handleYoyoFrame
     * @private
     * @since 3.12.0
     *
     * @param {Phaser.Animations.AnimationState} state - The Animation State to advance.
     * @param {boolean} isReverse - Is animation in reverse mode? (Default: false)
     */
    handleYoyoFrame: function (state, isReverse)
    {
        if (!isReverse) { isReverse = false; }

        if (state.inReverse === !isReverse && state.repeatCounter > 0)
        {
            if (state.repeatDelay === 0 || state.pendingRepeat)
            {
                state.forward = isReverse;
            }

            this.repeatAnimation(state);

            return;
        }

        if (state.inReverse !== isReverse && state.repeatCounter === 0)
        {
            state.complete();

            return;
        }

        state.forward = isReverse;

        var frame = (isReverse) ? state.currentFrame.nextFrame : state.currentFrame.prevFrame;

        this.updateAndGetNextTick(state, frame);
    },

    /**
     * Returns the animation last frame.
     *
     * @method Phaser.Animations.Animation#getLastFrame
     * @since 3.12.0
     *
     * @return {Phaser.Animations.AnimationFrame} The last Animation Frame.
     */
    getLastFrame: function ()
    {
        return this.frames[this.frames.length - 1];
    },

    /**
     * Called internally when the Animation is playing backwards.
     * Sets the previous frame, causing a yoyo, repeat, complete or update, accordingly.
     *
     * @method Phaser.Animations.Animation#previousFrame
     * @since 3.0.0
     *
     * @param {Phaser.Animations.AnimationState} state - The Animation State belonging to the Game Object invoking this call.
     */
    previousFrame: function (state)
    {
        var frame = state.currentFrame;

        if (frame.isFirst)
        {
            //  We're at the start of the animation
            if (state.yoyo)
            {
                this.handleYoyoFrame(state, true);
            }
            else if (state.repeatCounter > 0)
            {
                if (state.inReverse && !state.forward)
                {
                    this.repeatAnimation(state);
                }
                else
                {
                    //  Repeat (happens before complete)
                    state.forward = true;

                    this.repeatAnimation(state);
                }
            }
            else
            {
                state.complete();
            }
        }
        else
        {
            this.updateAndGetNextTick(state, frame.prevFrame);
        }
    },

    /**
     * Update Frame and Wait next tick.
     *
     * @method Phaser.Animations.Animation#updateAndGetNextTick
     * @private
     * @since 3.12.0
     *
     * @param {Phaser.Animations.AnimationState} state - The Animation State.
     * @param {Phaser.Animations.AnimationFrame} frame - An Animation frame.
     */
    updateAndGetNextTick: function (state, frame)
    {
        state.setCurrentFrame(frame);

        this.getNextTick(state);
    },

    /**
     * Removes the given AnimationFrame from this Animation instance.
     * This is a global action. Any Game Object using this Animation will be impacted by this change.
     *
     * @method Phaser.Animations.Animation#removeFrame
     * @since 3.0.0
     *
     * @param {Phaser.Animations.AnimationFrame} frame - The AnimationFrame to be removed.
     *
     * @return {this} This Animation object.
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
     * @param {number} index - The index in the AnimationFrame array
     *
     * @return {this} This Animation object.
     */
    removeFrameAt: function (index)
    {
        this.frames.splice(index, 1);

        this.updateFrameSequence();

        return this;
    },

    /**
     * Called internally during playback. Forces the animation to repeat, providing there are enough counts left
     * in the repeat counter.
     *
     * @method Phaser.Animations.Animation#repeatAnimation
     * @fires Phaser.Animations.Events#ANIMATION_REPEAT
     * @fires Phaser.Animations.Events#SPRITE_ANIMATION_REPEAT
     * @fires Phaser.Animations.Events#SPRITE_ANIMATION_KEY_REPEAT
     * @since 3.0.0
     *
     * @param {Phaser.Animations.AnimationState} state - The Animation State belonging to the Game Object invoking this call.
     */
    repeatAnimation: function (state)
    {
        if (state._pendingStop === 2)
        {
            if (state._pendingStopValue === 0)
            {
                return state.stop();
            }
            else
            {
                state._pendingStopValue--;
            }
        }

        if (state.repeatDelay > 0 && !state.pendingRepeat)
        {
            state.pendingRepeat = true;
            state.accumulator -= state.nextTick;
            state.nextTick += state.repeatDelay;
        }
        else
        {
            state.repeatCounter--;

            if (state.forward)
            {
                state.setCurrentFrame(state.currentFrame.nextFrame);
            }
            else
            {
                state.setCurrentFrame(state.currentFrame.prevFrame);
            }

            if (state.isPlaying)
            {
                this.getNextTick(state);

                state.handleRepeat();
            }
        }
    },

    /**
     * Converts the animation data to JSON.
     *
     * @method Phaser.Animations.Animation#toJSON
     * @since 3.0.0
     *
     * @return {Phaser.Types.Animations.JSONAnimation} The resulting JSONAnimation formatted object.
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
            showBeforeDelay: this.showBeforeDelay,
            showOnStart: this.showOnStart,
            randomFrame: this.randomFrame,
            hideOnComplete: this.hideOnComplete
        };

        this.frames.forEach(function (frame)
        {
            output.frames.push(frame.toJSON());
        });

        return output;
    },

    /**
     * Called internally whenever frames are added to, or removed from, this Animation.
     *
     * @method Phaser.Animations.Animation#updateFrameSequence
     * @since 3.0.0
     *
     * @return {this} This Animation object.
     */
    updateFrameSequence: function ()
    {
        var len = this.frames.length;
        var slice = 1 / (len - 1);

        var frame;

        for (var i = 0; i < len; i++)
        {
            frame = this.frames[i];

            frame.index = i + 1;
            frame.isFirst = false;
            frame.isLast = false;
            frame.progress = i * slice;

            if (i === 0)
            {
                frame.isFirst = true;

                if (len === 1)
                {
                    frame.isLast = true;
                    frame.nextFrame = frame;
                    frame.prevFrame = frame;
                }
                else
                {
                    frame.isLast = false;
                    frame.prevFrame = this.frames[len - 1];
                    frame.nextFrame = this.frames[i + 1];
                }
            }
            else if (i === len - 1 && len > 1)
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
     * Pauses playback of this Animation. The paused state is set immediately.
     *
     * @method Phaser.Animations.Animation#pause
     * @since 3.0.0
     *
     * @return {this} This Animation object.
     */
    pause: function ()
    {
        this.paused = true;

        return this;
    },

    /**
     * Resumes playback of this Animation. The paused state is reset immediately.
     *
     * @method Phaser.Animations.Animation#resume
     * @since 3.0.0
     *
     * @return {this} This Animation object.
     */
    resume: function ()
    {
        this.paused = false;

        return this;
    },

    /**
     * Destroys this Animation instance. It will remove all event listeners,
     * remove this animation and its key from the global Animation Manager,
     * and then destroy all Animation Frames in turn.
     *
     * @method Phaser.Animations.Animation#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        if (this.manager.off)
        {
            this.manager.off(Events.PAUSE_ALL, this.pause, this);
            this.manager.off(Events.RESUME_ALL, this.resume, this);
        }

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
