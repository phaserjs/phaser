/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BaseAnimation = require('../../animations/Animation');
var Class = require('../../utils/Class');
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
         * The key of the next Animation to be loaded into this Animation Controller when the current animation completes.
         *
         * @name Phaser.GameObjects.Components.Animation#nextAnim
         * @type {?string}
         * @default null
         * @since 3.16.0
         */
        this.nextAnim = null;

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
         * An internal counter keeping track of how many repeats are left to play.
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
     * Call this method with no arguments to reset the chained animation.
     *
     * @method Phaser.GameObjects.Components.Animation#chain
     * @since 3.16.0
     *
     * @param {(string|Phaser.Animations.Animation)} [key] - The string-based key of the animation to play next, as defined previously in the Animation Manager. Or an Animation instance.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    chain: function (key)
    {
        if (key instanceof BaseAnimation)
        {
            key = key.key;
        }

        this.nextAnim = key;

        return this.parent;
    },

    /**
     * Sets the amount of time, in milliseconds, that the animation will be delayed before starting playback.
     *
     * @method Phaser.GameObjects.Components.Animation#setDelay
     * @since 3.4.0
     *
     * @param {integer} [value=0] - The amount of time, in milliseconds, to wait before starting playback.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    setDelay: function (value)
    {
        if (value === undefined) { value = 0; }

        this._delay = value;

        return this.parent;
    },

    /**
     * Gets the amount of time, in milliseconds that the animation will be delayed before starting playback.
     *
     * @method Phaser.GameObjects.Components.Animation#getDelay
     * @since 3.4.0
     *
     * @return {integer} The amount of time, in milliseconds, the Animation will wait before starting playback.
     */
    getDelay: function ()
    {
        return this._delay;
    },

    /**
     * Waits for the specified delay, in milliseconds, then starts playback of the requested animation.
     *
     * @method Phaser.GameObjects.Components.Animation#delayedPlay
     * @since 3.0.0
     *
     * @param {integer} delay - The delay, in milliseconds, to wait before starting the animation playing.
     * @param {string} key - The key of the animation to play.
     * @param {integer} [startFrame=0] - The frame of the animation to start from.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    delayedPlay: function (delay, key, startFrame)
    {
        this.play(key, true, startFrame);

        this.nextTick += delay;

        return this.parent;
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
     * @param {string} key - The key of the animation to load.
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

        //  Load the new animation in
        this.animationManager.load(this, key, startFrame);

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
     * @fires Phaser.GameObjects.Components.Animation#onStartEvent
     * @since 3.0.0
     *
     * @param {(string|Phaser.Animations.Animation)} key - The string-based key of the animation to play, as defined previously in the Animation Manager. Or an Animation instance.
     * @param {boolean} [ignoreIfPlaying=false] - If this animation is already playing then ignore this call.
     * @param {integer} [startFrame=0] - Optionally start the animation playing from this frame index.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    play: function (key, ignoreIfPlaying, startFrame)
    {
        if (ignoreIfPlaying === undefined) { ignoreIfPlaying = false; }
        if (startFrame === undefined) { startFrame = 0; }

        if (key instanceof BaseAnimation)
        {
            key = key.key;
        }

        if (ignoreIfPlaying && this.isPlaying && this.currentAnim.key === key)
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
     * Plays an Animation (in reverse mode) on the Game Object that owns this Animation Component.
     *
     * @method Phaser.GameObjects.Components.Animation#playReverse
     * @fires Phaser.GameObjects.Components.Animation#onStartEvent
     * @since 3.12.0
     *
     * @param {(string|Phaser.Animations.Animation)} key - The string-based key of the animation to play, as defined previously in the Animation Manager. Or an Animation instance.
     * @param {boolean} [ignoreIfPlaying=false] - If an animation is already playing then ignore this call.
     * @param {integer} [startFrame=0] - Optionally start the animation playing from this frame index.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    playReverse: function (key, ignoreIfPlaying, startFrame)
    {
        if (ignoreIfPlaying === undefined) { ignoreIfPlaying = false; }
        if (startFrame === undefined) { startFrame = 0; }

        if (key instanceof BaseAnimation)
        {
            key = key.key;
        }

        if (ignoreIfPlaying && this.isPlaying && this.currentAnim.key === key)
        {
            return this.parent;
        }

        this.forward = false;
        this._reverse = true;

        return this._startAnimation(key, startFrame);
    },

    /**
     * Load an Animation and fires 'onStartEvent' event, extracted from 'play' method.
     *
     * @method Phaser.GameObjects.Components.Animation#_startAnimation
     * @fires Phaser.Animations.Events#START_ANIMATION_EVENT
     * @fires Phaser.Animations.Events#SPRITE_START_ANIMATION_EVENT
     * @fires Phaser.Animations.Events#SPRITE_START_KEY_ANIMATION_EVENT
     * @since 3.12.0
     *
     * @param {string} key - The string-based key of the animation to play, as defined previously in the Animation Manager.
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

        if (anim.showOnStart)
        {
            gameObject.visible = true;
        }

        var frame = this.currentFrame;

        anim.emit(Events.ANIMATION_START, anim, frame, gameObject);

        gameObject.emit(Events.SPRITE_ANIMATION_KEY_START + key, anim, frame, gameObject);

        gameObject.emit(Events.SPRITE_ANIMATION_START, anim, frame, gameObject);

        return gameObject;
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
     * Restarts the current animation from its beginning, optionally including its delay value.
     *
     * @method Phaser.GameObjects.Components.Animation#restart
     * @fires Phaser.Animations.Events#RESTART_ANIMATION_EVENT
     * @fires Phaser.Animations.Events#SPRITE_RESTART_ANIMATION_EVENT
     * @fires Phaser.Animations.Events#SPRITE_RESTART_KEY_ANIMATION_EVENT
     * @since 3.0.0
     *
     * @param {boolean} [includeDelay=false] - Whether to include the delay value of the animation when restarting.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    restart: function (includeDelay)
    {
        if (includeDelay === undefined) { includeDelay = false; }

        var anim = this.currentAnim;

        anim.getFirstTick(this, includeDelay);

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
     * @fires Phaser.GameObjects.Components.Animation#onCompleteEvent
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
            anim.emit(Events.ANIMATION_COMPLETE, anim, frame, gameObject);

            gameObject.emit(Events.SPRITE_ANIMATION_KEY_COMPLETE + anim.key, anim, frame, gameObject);
    
            gameObject.emit(Events.SPRITE_ANIMATION_COMPLETE, anim, frame, gameObject);
        }

        if (this.nextAnim)
        {
            var key = this.nextAnim;

            this.nextAnim = null;

            this.play(key);
        }

        return gameObject;
    },

    /**
     * Stops the current animation from playing after the specified time delay, given in milliseconds.
     *
     * @method Phaser.GameObjects.Components.Animation#stopAfterDelay
     * @fires Phaser.GameObjects.Components.Animation#onCompleteEvent
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
     * @fires Phaser.GameObjects.Components.Animation#onCompleteEvent
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
     * @fires Phaser.GameObjects.Components.Animation#onCompleteEvent
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
     * Sets the Time Scale factor, allowing you to make the animation go go faster or slower than default.
     * Where 1 = normal speed (the default), 0.5 = half speed, 2 = double speed, etc.
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

        if (this.accumulator >= this.nextTick)
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

        if (animationFrame.frame.customPivot)
        {
            gameObject.setOrigin(animationFrame.frame.pivotX, animationFrame.frame.pivotY);
        }
        else
        {
            gameObject.updateDisplayOrigin();
        }

        return gameObject;
    },

    /**
     * Internal frame change handler.
     *
     * @method Phaser.GameObjects.Components.Animation#updateFrame
     * @fires Phaser.Animations.Events#SPRITE_ANIMATION_UPDATE_EVENT
     * @fires Phaser.Animations.Events#SPRITE_ANIMATION_KEY_UPDATE_EVENT
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

        this.currentAnim = null;
        this.currentFrame = null;
    }

});

module.exports = Animation;
