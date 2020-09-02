/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BaseAnimation = require('../../animations/Animation');
var Class = require('../../utils/Class');
var GetFastValue = require('../../utils/object/GetFastValue');
var Events = require('../../animations/events');

/**
 * @classdesc
 * A Game Object Animation Controller.
 *
 * This controller lives as an instance within a Game Object, accessible as `sprite.anims`.
 *
 * @class Animation
 * @memberof Phaser.GameObjects.Components
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} parent - The Game Object to which this animation controller belongs.
 */
var Animation = new Class({

    initialize:

    function Animation (parent)
    {
        /**
         * The Game Object to which this animation controller belongs.
         *
         * @name Phaser.GameObjects.Components.Animation#parent
         * @type {Phaser.GameObjects.GameObject}
         * @since 3.0.0
         */
        this.parent = parent;

        /**
         * A reference to the global Animation Manager.
         *
         * @name Phaser.GameObjects.Components.Animation#animationManager
         * @type {Phaser.Animations.AnimationManager}
         * @since 3.0.0
         */
        this.animationManager = parent.scene.sys.anims;

        this.animationManager.once(Events.REMOVE_ANIMATION, this.remove, this);

        /**
         * Is an animation currently playing or not?
         *
         * @name Phaser.GameObjects.Components.Animation#isPlaying
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.isPlaying = false;

        /**
         * Has the current animation started playing, or is it waiting for a delay to expire?
         *
         * @name Phaser.GameObjects.Components.Animation#hasStarted
         * @type {boolean}
         * @default false
         * @since 3.50.0
         */
        this.hasStarted = false;

        /**
         * The current Animation loaded into this Animation Controller.
         *
         * @name Phaser.GameObjects.Components.Animation#currentAnim
         * @type {?Phaser.Animations.Animation}
         * @default null
         * @since 3.0.0
         */
        this.currentAnim = null;

        /**
         * The current AnimationFrame being displayed by this Animation Controller.
         *
         * @name Phaser.GameObjects.Components.Animation#currentFrame
         * @type {?Phaser.Animations.AnimationFrame}
         * @default null
         * @since 3.0.0
         */
        this.currentFrame = null;

        /**
         * The key, instance of config of the next Animation to be loaded into this Animation Controller when the current animation completes.
         *
         * @name Phaser.GameObjects.Components.Animation#nextAnim
         * @type {?(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)}
         * @default null
         * @since 3.16.0
         */
        this.nextAnim = null;

        /**
         * A queue of keys of the next Animations to be loaded into this Animation Controller when the current animation completes.
         *
         * @name Phaser.GameObjects.Components.Animation#nextAnimsQueue
         * @type {array}
         * @since 3.24.0
         */
        this.nextAnimsQueue = [];

        /**
         * Time scale factor.
         *
         * @name Phaser.GameObjects.Components.Animation#_timeScale
         * @type {number}
         * @private
         * @default 1
         * @since 3.0.0
         */
        this._timeScale = 1;

        /**
         * The frame rate of playback in frames per second.
         * The default is 24 if the `duration` property is `null`.
         *
         * @name Phaser.GameObjects.Components.Animation#frameRate
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.frameRate = 0;

        /**
         * How long the animation should play for, in milliseconds.
         * If the `frameRate` property has been set then it overrides this value,
         * otherwise the `frameRate` is derived from `duration`.
         *
         * @name Phaser.GameObjects.Components.Animation#duration
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.duration = 0;

        /**
         * ms per frame, not including frame specific modifiers that may be present in the Animation data.
         *
         * @name Phaser.GameObjects.Components.Animation#msPerFrame
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.msPerFrame = 0;

        /**
         * Skip frames if the time lags, or always advanced anyway?
         *
         * @name Phaser.GameObjects.Components.Animation#skipMissedFrames
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.skipMissedFrames = true;

        /**
         * A delay before starting playback, in milliseconds.
         *
         * @name Phaser.GameObjects.Components.Animation#_delay
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._delay = 0;

        /**
         * Number of times to repeat the animation (-1 for infinity)
         *
         * @name Phaser.GameObjects.Components.Animation#_repeat
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._repeat = 0;

        /**
         * Delay before the repeat starts, in milliseconds.
         *
         * @name Phaser.GameObjects.Components.Animation#_repeatDelay
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._repeatDelay = 0;

        /**
         * Should the animation yoyo? (reverse back down to the start) before repeating?
         *
         * @name Phaser.GameObjects.Components.Animation#_yoyo
         * @type {boolean}
         * @private
         * @default false
         * @since 3.0.0
         */
        this._yoyo = false;

        /**
         * Will the playhead move forwards (`true`) or in reverse (`false`).
         *
         * @name Phaser.GameObjects.Components.Animation#forward
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.forward = true;

        /**
         * An Internal trigger that's play the animation in reverse mode ('true') or not ('false'),
         * needed because forward can be changed by yoyo feature.
         *
         * @name Phaser.GameObjects.Components.Animation#_reverse
         * @type {boolean}
         * @default false
         * @private
         * @since 3.12.0
         */
        this._reverse = false;

        /**
         * Internal time overflow accumulator.
         *
         * @name Phaser.GameObjects.Components.Animation#accumulator
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.accumulator = 0;

        /**
         * The time point at which the next animation frame will change.
         *
         * @name Phaser.GameObjects.Components.Animation#nextTick
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.nextTick = 0;

        /**
         * An internal counter keeping track of how much delay time is left before playback begins.
         *
         * This is set via the `delayedPlay` method.
         *
         * @name Phaser.GameObjects.Components.Animation#delayCounter
         * @type {number}
         * @default 0
         * @since 3.50.0
         */
        this.delayCounter = 0;

        /**
         * An internal counter keeping track of how many repeats are left to run.
         *
         * @name Phaser.GameObjects.Components.Animation#repeatCounter
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.repeatCounter = 0;

        /**
         * An internal flag keeping track of pending repeats.
         *
         * @name Phaser.GameObjects.Components.Animation#pendingRepeat
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.pendingRepeat = false;

        /**
         * Is the Animation paused?
         *
         * @name Phaser.GameObjects.Components.Animation#_paused
         * @type {boolean}
         * @private
         * @default false
         * @since 3.0.0
         */
        this._paused = false;

        /**
         * Was the animation previously playing before being paused?
         *
         * @name Phaser.GameObjects.Components.Animation#_wasPlaying
         * @type {boolean}
         * @private
         * @default false
         * @since 3.0.0
         */
        this._wasPlaying = false;

        /**
         * Internal property tracking if this Animation is waiting to stop.
         *
         * 0 = No
         * 1 = Waiting for ms to pass
         * 2 = Waiting for repeat
         * 3 = Waiting for specific frame
         *
         * @name Phaser.GameObjects.Components.Animation#_pendingStop
         * @type {integer}
         * @private
         * @since 3.4.0
         */
        this._pendingStop = 0;

        /**
         * Internal property used by _pendingStop.
         *
         * @name Phaser.GameObjects.Components.Animation#_pendingStopValue
         * @type {any}
         * @private
         * @since 3.4.0
         */
        this._pendingStopValue;

        /**
         * Should the GameObject's `visible` property be set to `true` when the animation starts to play?
         *
         * @name Phaser.GameObjects.Components.Animation#showOnStart
         * @type {boolean}
         * @since 3.50.0
         */
        this.showOnStart = false;

        /**
         * Should the GameObject's `visible` property be set to `false` when the animation finishes?
         *
         * @name Phaser.GameObjects.Components.Animation#hideOnComplete
         * @type {boolean}
         * @since 3.50.0
         */
        this.hideOnComplete = false;
    },

    /**
     * Sets an animation to be played immediately after the current one completes.
     *
     * The current animation must enter a 'completed' state for this to happen, i.e. finish all of its repeats, delays, etc, or have the `stop` method called directly on it.
     *
     * An animation set to repeat forever will never enter a completed state.
     *
     * You can chain a new animation at any point, including before the current one starts playing, during it, or when it ends (via its `animationcomplete` callback).
     * Chained animations are specific to a Game Object, meaning different Game Objects can have different chained animations without impacting the global animation they're playing.
     *
     * Call this method with no arguments to reset all chained animations.
     *
     * @method Phaser.GameObjects.Components.Animation#chain
     * @since 3.16.0
     *
     * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    chain: function (key)
    {
        var parent = this.parent;

        if (key === undefined)
        {
            this.nextAnimsQueue.length = 0;
            this.nextAnim = null;

            return parent;
        }

        if (this.nextAnim === null)
        {
            this.nextAnim = key;
        }
        else
        {
            this.nextAnimsQueue.push(key);
        }

        return parent;
    },

    /**
     * Returns the key of the animation currently loaded into this component.
     *
     * @method Phaser.GameObjects.Components.Animation#getCurrentKey
     * @since 3.0.0
     *
     * @return {string} The key of the Animation loaded into this component.
     */
    getCurrentKey: function ()
    {
        if (this.currentAnim)
        {
            return this.currentAnim.key;
        }
    },

    /**
     * Internal method used to load an animation into this component.
     *
     * @method Phaser.GameObjects.Components.Animation#load
     * @protected
     * @since 3.0.0
     *
     * @param {(string|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or a `PlayAnimationConfig` object.
     * @param {integer} [startFrame=0] - The start frame of the animation to load.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    load: function (key, startFrame)
    {
        if (startFrame === undefined) { startFrame = 0; }

        if (this.isPlaying)
        {
            this.stop();
        }

        var manager = this.animationManager;

        if (typeof key === 'string')
        {
            //  Load the new animation data in
            manager.load(this, key, startFrame);
        }
        else
        {
            var animKey = GetFastValue(key, 'key', null);

            startFrame = GetFastValue(key, 'startFrame', startFrame);

            if (animKey)
            {
                //  Load the new animation data in
                manager.load(this, animKey, startFrame);

                var anim = this.currentAnim;

                //  And now override the animation values, if set in the config.

                var totalFrames = anim.getTotalFrames();
                var frameRate = GetFastValue(key, 'frameRate', this.frameRate);
                var duration = GetFastValue(key, 'duration', this.duration);

                anim.calculateDuration(this, totalFrames, duration, frameRate);

                this._delay = GetFastValue(key, 'delay', this._delay);
                this._repeat = GetFastValue(key, 'repeat', this._repeat);
                this._repeatDelay = GetFastValue(key, 'repeatDelay', this._repeatDelay);
                this._yoyo = GetFastValue(key, 'yoyo', this._yoyo);
                this._timeScale = GetFastValue(key, 'timeScale', this._timeScale);

                this.showOnStart = GetFastValue(key, 'showOnStart', this.showOnStart);
                this.hideOnComplete = GetFastValue(key, 'hideOnComplete', this.hideOnComplete);
            }
        }

        return this.parent;
    },

    /**
     * Pause the current animation and set the `isPlaying` property to `false`.
     * You can optionally pause it at a specific frame.
     *
     * @method Phaser.GameObjects.Components.Animation#pause
     * @since 3.0.0
     *
     * @param {Phaser.Animations.AnimationFrame} [atFrame] - An optional frame to set after pausing the animation.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    pause: function (atFrame)
    {
        if (!this._paused)
        {
            this._paused = true;
            this._wasPlaying = this.isPlaying;
            this.isPlaying = false;
        }

        if (atFrame !== undefined)
        {
            this.updateFrame(atFrame);
        }

        return this.parent;
    },

    /**
     * Resumes playback of a paused animation and sets the `isPlaying` property to `true`.
     * You can optionally tell it to start playback from a specific frame.
     *
     * @method Phaser.GameObjects.Components.Animation#resume
     * @since 3.0.0
     *
     * @param {Phaser.Animations.AnimationFrame} [fromFrame] - An optional frame to set before restarting playback.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    resume: function (fromFrame)
    {
        if (this._paused)
        {
            this._paused = false;
            this.isPlaying = this._wasPlaying;
        }

        if (fromFrame !== undefined)
        {
            this.updateFrame(fromFrame);
        }

        return this.parent;
    },

    /**
     * `true` if the current animation is paused, otherwise `false`.
     *
     * @name Phaser.GameObjects.Components.Animation#isPaused
     * @readonly
     * @type {boolean}
     * @since 3.4.0
     */
    isPaused: {

        get: function ()
        {
            return this._paused;
        }

    },

    /**
     * Plays an Animation on a Game Object that has the Animation component, such as a Sprite.
     *
     * Animations are stored in the global Animation Manager and are referenced by a unique string-based key.
     *
     * @method Phaser.GameObjects.Components.Animation#play
     * @fires Phaser.Animations.Events#ANIMATION_START
     * @fires Phaser.Animations.Events#SPRITE_ANIMATION_START
     * @fires Phaser.Animations.Events#SPRITE_ANIMATION_KEY_START
     * @since 3.0.0
     *
     * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
     * @param {boolean} [ignoreIfPlaying=false] - If this animation is already playing then ignore this call.
     * @param {integer} [startFrame=0] - Optionally start the animation playing from this frame index.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    play: function (key, ignoreIfPlaying, startFrame)
    {
        if (ignoreIfPlaying === undefined) { ignoreIfPlaying = false; }
        if (startFrame === undefined) { startFrame = 0; }

        //  Must be either an Animation instance, or a PlayAnimationConfig object
        var animKey = (typeof key === 'string') ? key : key.key;

        if (ignoreIfPlaying && this.isPlaying && this.currentAnim.key === animKey)
        {
            return this.parent;
        }

        this.forward = true;

        this._reverse = false;
        this._paused = false;
        this._wasPlaying = true;

        return this._startAnimation(key, startFrame);
    },

    /**
     * Plays an Animation in reverse on the Game Object that owns this Animation Component.
     *
     * @method Phaser.GameObjects.Components.Animation#playReverse
     * @fires Phaser.Animations.Events#ANIMATION_START
     * @fires Phaser.Animations.Events#SPRITE_ANIMATION_START
     * @fires Phaser.Animations.Events#SPRITE_ANIMATION_KEY_START
     * @since 3.12.0
     *
     * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
     * @param {boolean} [ignoreIfPlaying=false] - If an animation is already playing then ignore this call.
     * @param {integer} [startFrame=0] - Optionally start the animation playing from this frame index.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    playReverse: function (key, ignoreIfPlaying, startFrame)
    {
        if (ignoreIfPlaying === undefined) { ignoreIfPlaying = false; }
        if (startFrame === undefined) { startFrame = 0; }

        //  Must be either an Animation instance, or a PlayAnimationConfig object
        var animKey = (typeof key === 'string') ? key : key.key;

        if (ignoreIfPlaying && this.isPlaying && this.currentAnim.key === animKey)
        {
            return this.parent;
        }

        this.forward = false;

        this._reverse = true;
        this._paused = false;
        this._wasPlaying = true;

        return this._startAnimation(key, startFrame);
    },

    /**
     * Waits for the specified delay, in milliseconds, then starts playback of the requested animation.
     *
     * If the animation _also_ has a delay value set in its config, this value will override that and be used instead.
     *
     * The delay only takes effect if the animation has not already started playing.
     *
     * @method Phaser.GameObjects.Components.Animation#delayedPlay
     * @fires Phaser.Animations.Events#ANIMATION_START
     * @fires Phaser.Animations.Events#SPRITE_ANIMATION_START
     * @fires Phaser.Animations.Events#SPRITE_ANIMATION_KEY_START
     * @since 3.0.0
     *
     * @param {integer} delay - The delay, in milliseconds, to wait before starting the animation playing.
     * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
     * @param {integer} [startFrame=0] - The frame of the animation to start from.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    delayedPlay: function (delay, key, startFrame)
    {
        this.delayCounter = delay;

        return this.play(key, true, startFrame);
    },

    /**
     * Load the animation based on the key and set-up all of the internal values
     * needed for playback to start. If there is no delay, it will also fire the start events.
     *
     * @method Phaser.GameObjects.Components.Animation#_startAnimation
     * @fires Phaser.Animations.Events#ANIMATION_START
     * @fires Phaser.Animations.Events#SPRITE_ANIMATION_START
     * @fires Phaser.Animations.Events#SPRITE_ANIMATION_KEY_START
     * @private
     * @since 3.12.0
     *
     * @param {(string|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or a `PlayAnimationConfig` object.
     * @param {integer} [startFrame=0] - Optionally start the animation playing from this frame index.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    _startAnimation: function (key, startFrame)
    {
        this.load(key, startFrame);

        var anim = this.currentAnim;
        var gameObject = this.parent;

        if (!anim)
        {
            return gameObject;
        }

        //  Should give us 9,007,199,254,740,991 safe repeats
        this.repeatCounter = (this._repeat === -1) ? Number.MAX_VALUE : this._repeat;

        anim.getFirstTick(this);

        this.isPlaying = true;
        this.pendingRepeat = false;
        this.hasStarted = false;

        //  Add any delay the animation itself may have had as well
        this.delayCounter += this._delay;

        if (this.delayCounter === 0)
        {
            this._fireStartEvents();
        }

        return gameObject;
    },

    /**
     * Fires all of the animation start events and toggles internal flags.
     *
     * @method Phaser.GameObjects.Components.Animation#_fireStartEvents
     * @fires Phaser.Animations.Events#ANIMATION_START
     * @fires Phaser.Animations.Events#SPRITE_ANIMATION_START
     * @fires Phaser.Animations.Events#SPRITE_ANIMATION_KEY_START
     * @private
     * @since 3.50.0
     */
    _fireStartEvents: function ()
    {
        var anim = this.currentAnim;
        var gameObject = this.parent;

        if (this.showOnStart)
        {
            gameObject.setVisible(true);
        }

        this.hasStarted = true;

        var frame = this.currentFrame;

        anim.emit(Events.ANIMATION_START, anim, frame, gameObject);

        gameObject.emit(Events.SPRITE_ANIMATION_KEY_START + anim.key, anim, frame, gameObject);

        gameObject.emit(Events.SPRITE_ANIMATION_START, anim, frame, gameObject);
    },

    /**
     * Reverse the Animation that is already playing on the Game Object.
     *
     * @method Phaser.GameObjects.Components.Animation#reverse
     * @since 3.12.0
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    reverse: function ()
    {
        if (this.isPlaying)
        {
            this._reverse = !this._reverse;

            this.forward = !this.forward;
        }

        return this.parent;
    },

    /**
     * Returns a value between 0 and 1 indicating how far this animation is through, ignoring repeats and yoyos.
     * If the animation has a non-zero repeat defined, `getProgress` and `getTotalProgress` will be different
     * because `getProgress` doesn't include any repeats or repeat delays, whereas `getTotalProgress` does.
     *
     * @method Phaser.GameObjects.Components.Animation#getProgress
     * @since 3.4.0
     *
     * @return {number} The progress of the current animation, between 0 and 1.
     */
    getProgress: function ()
    {
        var p = this.currentFrame.progress;

        if (!this.forward)
        {
            p = 1 - p;
        }

        return p;
    },

    /**
     * Takes a value between 0 and 1 and uses it to set how far this animation is through playback.
     * Does not factor in repeats or yoyos, but does handle playing forwards or backwards.
     *
     * @method Phaser.GameObjects.Components.Animation#setProgress
     * @since 3.4.0
     *
     * @param {number} [value=0] - The progress value, between 0 and 1.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    setProgress: function (value)
    {
        if (!this.forward)
        {
            value = 1 - value;
        }

        this.setCurrentFrame(this.currentAnim.getFrameByProgress(value));

        return this.parent;
    },

    /**
     * Handle the removal of an animation from the Animation Manager.
     *
     * @method Phaser.GameObjects.Components.Animation#remove
     * @since 3.0.0
     *
     * @param {string} [key] - The key of the removed Animation.
     * @param {Phaser.Animations.Animation} [animation] - The removed Animation.
     */
    remove: function (key, animation)
    {
        if (animation === undefined) { animation = this.currentAnim; }

        if (this.isPlaying && animation.key === this.currentAnim.key)
        {
            this.stop();

            this.setCurrentFrame(this.currentAnim.frames[0]);
        }
    },

    /**
     * Gets the number of times that the animation will repeat
     * after its first iteration. For example, if returns 1, the animation will
     * play a total of twice (the initial play plus 1 repeat).
     * A value of -1 means the animation will repeat indefinitely.
     *
     * @method Phaser.GameObjects.Components.Animation#getRepeat
     * @since 3.4.0
     *
     * @return {integer} The number of times that the animation will repeat.
     */
    getRepeat: function ()
    {
        return this._repeat;
    },

    /**
     * Sets the number of times that the animation should repeat
     * after its first iteration. For example, if repeat is 1, the animation will
     * play a total of twice (the initial play plus 1 repeat).
     * To repeat indefinitely, use -1. repeat should always be an integer.
     *
     * @method Phaser.GameObjects.Components.Animation#setRepeat
     * @since 3.4.0
     *
     * @param {integer} value - The number of times that the animation should repeat.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    setRepeat: function (value)
    {
        this._repeat = value;

        this.repeatCounter = (value === -1) ? Number.MAX_VALUE : value;

        return this.parent;
    },

    /**
     * Gets the amount of delay between repeats, if any.
     *
     * @method Phaser.GameObjects.Components.Animation#getRepeatDelay
     * @since 3.4.0
     *
     * @return {number} The delay between repeats.
     */
    getRepeatDelay: function ()
    {
        return this._repeatDelay;
    },

    /**
     * Sets the amount of time in seconds between repeats.
     * For example, if `repeat` is 2 and `repeatDelay` is 10, the animation will play initially,
     * then wait for 10 seconds before repeating, then play again, then wait another 10 seconds
     * before doing its final repeat.
     *
     * @method Phaser.GameObjects.Components.Animation#setRepeatDelay
     * @since 3.4.0
     *
     * @param {number} value - The delay to wait between repeats, in seconds.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    setRepeatDelay: function (value)
    {
        this._repeatDelay = value;

        return this.parent;
    },

    /**
     * Restarts the current animation from its beginning.
     *
     * You can optionally reset the delay and repeat counters as well.
     *
     * Calling this will fire the `ANIMATION_RESTART` series of events immediately.
     *
     * @method Phaser.GameObjects.Components.Animation#restart
     * @fires Phaser.Animations.Events#ANIMATION_RESTART
     * @fires Phaser.Animations.Events#SPRITE_ANIMATION_RESTART
     * @fires Phaser.Animations.Events#SPRITE_ANIMATION_KEY_RESTART
     * @since 3.0.0
     *
     * @param {boolean} [includeDelay=false] - Whether to include the delay value of the animation when restarting.
     * @param {boolean} [resetRepeats=false] - Whether to reset the repeat counter or not?
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    restart: function (includeDelay, resetRepeats)
    {
        if (includeDelay === undefined) { includeDelay = false; }
        if (resetRepeats === undefined) { resetRepeats = false; }

        var anim = this.currentAnim;

        anim.getFirstTick(this, includeDelay);

        if (resetRepeats)
        {
            this.repeatCounter = (this._repeat === -1) ? Number.MAX_VALUE : this._repeat;
        }

        this.forward = true;
        this.isPlaying = true;
        this.pendingRepeat = false;
        this._paused = false;

        //  Set frame
        this.updateFrame(anim.frames[0]);

        var gameObject = this.parent;
        var frame = this.currentFrame;

        anim.emit(Events.ANIMATION_RESTART, anim, frame, gameObject);

        gameObject.emit(Events.SPRITE_ANIMATION_KEY_RESTART + anim.key, anim, frame, gameObject);

        gameObject.emit(Events.SPRITE_ANIMATION_RESTART, anim, frame, gameObject);

        return this.parent;
    },

    /**
     * Immediately stops the current animation from playing and dispatches the `animationcomplete` event.
     *
     * If no animation is set, no event will be dispatched.
     *
     * If there is another animation queued (via the `chain` method) then it will start playing immediately.
     *
     * @method Phaser.GameObjects.Components.Animation#stop
     * @fires Phaser.Animations.Events#ANIMATION_COMPLETE
     * @fires Phaser.Animations.Events#SPRITE_ANIMATION_COMPLETE
     * @fires Phaser.Animations.Events#SPRITE_ANIMATION_KEY_COMPLETE
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    stop: function ()
    {
        this._pendingStop = 0;

        this.isPlaying = false;

        var gameObject = this.parent;
        var anim = this.currentAnim;
        var frame = this.currentFrame;

        if (anim)
        {
            if (this.hideOnComplete)
            {
                gameObject.setVisible(false);
            }

            anim.emit(Events.ANIMATION_COMPLETE, anim, frame, gameObject);

            gameObject.emit(Events.SPRITE_ANIMATION_KEY_COMPLETE + anim.key, anim, frame, gameObject);

            gameObject.emit(Events.SPRITE_ANIMATION_COMPLETE, anim, frame, gameObject);
        }

        if (this.nextAnim)
        {
            var key = this.nextAnim;

            this.nextAnim = (this.nextAnimsQueue.length > 0) ? this.nextAnimsQueue.shift() : null;

            this.play(key);
        }

        return gameObject;
    },

    /**
     * Stops the current animation from playing after the specified time delay, given in milliseconds.
     *
     * @method Phaser.GameObjects.Components.Animation#stopAfterDelay
     * @fires Phaser.Animations.Events#ANIMATION_COMPLETE
     * @fires Phaser.Animations.Events#SPRITE_ANIMATION_COMPLETE
     * @fires Phaser.Animations.Events#SPRITE_ANIMATION_KEY_COMPLETE
     * @since 3.4.0
     *
     * @param {integer} delay - The number of milliseconds to wait before stopping this animation.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    stopAfterDelay: function (delay)
    {
        this._pendingStop = 1;
        this._pendingStopValue = delay;

        return this.parent;
    },

    /**
     * Stops the current animation from playing when it next repeats.
     *
     * @method Phaser.GameObjects.Components.Animation#stopOnRepeat
     * @fires Phaser.Animations.Events#ANIMATION_COMPLETE
     * @fires Phaser.Animations.Events#SPRITE_ANIMATION_COMPLETE
     * @fires Phaser.Animations.Events#SPRITE_ANIMATION_KEY_COMPLETE
     * @since 3.4.0
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    stopOnRepeat: function ()
    {
        this._pendingStop = 2;

        return this.parent;
    },

    /**
     * Stops the current animation from playing when it next sets the given frame.
     * If this frame doesn't exist within the animation it will not stop it from playing.
     *
     * @method Phaser.GameObjects.Components.Animation#stopOnFrame
     * @fires Phaser.Animations.Events#ANIMATION_COMPLETE
     * @fires Phaser.Animations.Events#SPRITE_ANIMATION_COMPLETE
     * @fires Phaser.Animations.Events#SPRITE_ANIMATION_KEY_COMPLETE
     * @since 3.4.0
     *
     * @param {Phaser.Animations.AnimationFrame} frame - The frame to check before stopping this animation.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    stopOnFrame: function (frame)
    {
        this._pendingStop = 3;
        this._pendingStopValue = frame;

        return this.parent;
    },

    /**
     * Sets the Time Scale factor, allowing you to make the animation go faster or slower than default.
     * Where 1 = normal speed (the default), 0.5 = half speed, 2 = double speed, etc.
     *
     * Setting the time scale impacts all animations played on this Sprite from this point on.
     *
     * @method Phaser.GameObjects.Components.Animation#setTimeScale
     * @since 3.4.0
     *
     * @param {number} [value=1] - The time scale factor, where 1 is no change, 0.5 is half speed, etc.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    setTimeScale: function (value)
    {
        if (value === undefined) { value = 1; }

        this._timeScale = value;

        return this.parent;
    },

    /**
     * Gets the Time Scale factor.
     *
     * @method Phaser.GameObjects.Components.Animation#getTimeScale
     * @since 3.4.0
     *
     * @return {number} The Time Scale value.
     */
    getTimeScale: function ()
    {
        return this._timeScale;
    },

    /**
     * Returns the total number of frames in this animation.
     *
     * @method Phaser.GameObjects.Components.Animation#getTotalFrames
     * @since 3.4.0
     *
     * @return {integer} The total number of frames in this animation.
     */
    getTotalFrames: function ()
    {
        return this.currentAnim.frames.length;
    },

    /**
     * The internal update loop for the Animation Component.
     *
     * @method Phaser.GameObjects.Components.Animation#update
     * @since 3.0.0
     *
     * @param {number} time - The current timestamp.
     * @param {number} delta - The delta time, in ms, elapsed since the last frame.
     */
    update: function (time, delta)
    {
        if (!this.currentAnim || !this.isPlaying || this.currentAnim.paused)
        {
            return;
        }

        this.accumulator += delta * this._timeScale;

        if (this._pendingStop === 1)
        {
            this._pendingStopValue -= delta;

            if (this._pendingStopValue <= 0)
            {
                return this.currentAnim.completeAnimation(this);
            }
        }

        if (!this.hasStarted)
        {
            if (this.accumulator >= this.delayCounter)
            {
                this.accumulator -= this.delayCounter;

                this._fireStartEvents();
            }
        }
        else if (this.accumulator >= this.nextTick)
        {
            this.currentAnim.setFrame(this);
        }
    },

    /**
     * Sets the given Animation Frame as being the current frame
     * and applies it to the parent Game Object, adjusting its size and origin as needed.
     *
     * @method Phaser.GameObjects.Components.Animation#setCurrentFrame
     * @since 3.4.0
     *
     * @param {Phaser.Animations.AnimationFrame} animationFrame - The Animation Frame to set as being current.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object this Animation Component belongs to.
     */
    setCurrentFrame: function (animationFrame)
    {
        var gameObject = this.parent;

        this.currentFrame = animationFrame;

        gameObject.texture = animationFrame.frame.texture;
        gameObject.frame = animationFrame.frame;

        if (gameObject.isCropped)
        {
            gameObject.frame.updateCropUVs(gameObject._crop, gameObject.flipX, gameObject.flipY);
        }

        gameObject.setSizeToFrame();

        if (gameObject._originComponent)
        {
            if (animationFrame.frame.customPivot)
            {
                gameObject.setOrigin(animationFrame.frame.pivotX, animationFrame.frame.pivotY);
            }
            else
            {
                gameObject.updateDisplayOrigin();
            }
        }

        return gameObject;
    },

    /**
     * Internal frame change handler.
     *
     * @method Phaser.GameObjects.Components.Animation#updateFrame
     * @fires Phaser.Animations.Events#SPRITE_ANIMATION_UPDATE
     * @fires Phaser.Animations.Events#SPRITE_ANIMATION_KEY_UPDATE
     * @private
     * @since 3.0.0
     *
     * @param {Phaser.Animations.AnimationFrame} animationFrame - The animation frame to change to.
     */
    updateFrame: function (animationFrame)
    {
        var gameObject = this.setCurrentFrame(animationFrame);

        if (this.isPlaying)
        {
            if (animationFrame.setAlpha)
            {
                gameObject.alpha = animationFrame.alpha;
            }

            var anim = this.currentAnim;

            gameObject.emit(Events.SPRITE_ANIMATION_KEY_UPDATE + anim.key, anim, animationFrame, gameObject);

            gameObject.emit(Events.SPRITE_ANIMATION_UPDATE, anim, animationFrame, gameObject);

            if (this._pendingStop === 3 && this._pendingStopValue === animationFrame)
            {
                this.currentAnim.completeAnimation(this);
            }
        }
    },

    /**
     * Advances the animation to the next frame, regardless of the time or animation state.
     * If the animation is set to repeat, or yoyo, this will still take effect.
     *
     * Calling this does not change the direction of the animation. I.e. if it was currently
     * playing in reverse, calling this method doesn't then change the direction to forwards.
     *
     * @method Phaser.GameObjects.Components.Animation#nextFrame
     * @since 3.16.0
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object this Animation Component belongs to.
     */
    nextFrame: function ()
    {
        if (this.currentAnim)
        {
            this.currentAnim.nextFrame(this);
        }

        return this.parent;
    },

    /**
     * Advances the animation to the previous frame, regardless of the time or animation state.
     * If the animation is set to repeat, or yoyo, this will still take effect.
     *
     * Calling this does not change the direction of the animation. I.e. if it was currently
     * playing in forwards, calling this method doesn't then change the direction to backwards.
     *
     * @method Phaser.GameObjects.Components.Animation#previousFrame
     * @since 3.16.0
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object this Animation Component belongs to.
     */
    previousFrame: function ()
    {
        if (this.currentAnim)
        {
            this.currentAnim.previousFrame(this);
        }

        return this.parent;
    },

    /**
     * Sets if the current Animation will yoyo when it reaches the end.
     * A yoyo'ing animation will play through consecutively, and then reverse-play back to the start again.
     *
     * @method Phaser.GameObjects.Components.Animation#setYoyo
     * @since 3.4.0
     *
     * @param {boolean} [value=false] - `true` if the animation should yoyo, `false` to not.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object this Animation Component belongs to.
     */
    setYoyo: function (value)
    {
        if (value === undefined) { value = false; }

        this._yoyo = value;

        return this.parent;
    },

    /**
     * Gets if the current Animation will yoyo when it reaches the end.
     * A yoyo'ing animation will play through consecutively, and then reverse-play back to the start again.
     *
     * @method Phaser.GameObjects.Components.Animation#getYoyo
     * @since 3.4.0
     *
     * @return {boolean} `true` if the animation is set to yoyo, `false` if not.
     */
    getYoyo: function ()
    {
        return this._yoyo;
    },

    /**
     * Destroy this Animation component.
     *
     * Unregisters event listeners and cleans up its references.
     *
     * @method Phaser.GameObjects.Components.Animation#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.animationManager.off(Events.REMOVE_ANIMATION, this.remove, this);

        this.animationManager = null;
        this.parent = null;
        this.nextAnimsQueue.length = 0;

        this.currentAnim = null;
        this.currentFrame = null;
    }

});

module.exports = Animation;
