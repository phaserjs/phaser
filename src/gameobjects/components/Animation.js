/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');

/**
 * @classdesc
 * A Game Object Animation Controller.
 *
 * This controller lives as an instance within a Game Object, accessible as `sprite.anims`.
 *
 * @class Animation
 * @memberOf Phaser.GameObjects.Components
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

        this.animationManager.once('remove', this.remove, this);

        /**
         * Is an animation currently playing or not?
         *
         * @name Phaser.GameObjects.Components.Animation#isPlaying
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.isPlaying = false;

        //  Reference to the Phaser.Animation object

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
         * How long the animation should play for.
         * If the `frameRate` property has been set then it overrides this value,
         * otherwise frameRate is derived from `duration`.
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
         * A delay before starting playback, in seconds.
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
         * Delay before the repeat starts, in seconds.
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
         * Will the playhead move forwards (`true`) or in reverse (`false`)
         *
         * @name Phaser.GameObjects.Components.Animation#forward
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.forward = true;

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
         * Container for the callback arguments.
         *
         * @name Phaser.GameObjects.Components.Animation#_callbackArgs
         * @type {array}
         * @private
         * @since 3.0.0
         */
        this._callbackArgs = [ parent, null ];

        /**
         * Container for the update arguments.
         *
         * @name Phaser.GameObjects.Components.Animation#_updateParams
         * @type {array}
         * @private
         * @since 3.0.0
         */
        this._updateParams = [];
    },

    /**
     * Sets the amount of time, in seconds that the animation will be delayed before starting playback.
     * 
     * @method Phaser.GameObjects.Components.Animation#delay
     * @since 3.0.0
     *
     * @param {number} value - The amount of time, in seconds, to wait before starting playback.
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    delay: function (value)
    {
        if (value === undefined)
        {
            return this._delay;
        }
        else
        {
            this._delay = value;

            return this;
        }
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.Animation#delayedPlay
     * @since 3.0.0
     *
     * @param {[type]} delay - [description]
     * @param {[type]} key - [description]
     * @param {[type]} startFrame - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    delayedPlay: function (delay, key, startFrame)
    {
        this.play(key, true, startFrame);

        this.nextTick += (delay * 1000);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.Animation#getCurrentKey
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    getCurrentKey: function ()
    {
        if (this.currentAnim)
        {
            return this.currentAnim.key;
        }
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.Animation#load
     * @since 3.0.0
     *
     * @param {[type]} key - [description]
     * @param {[type]} startFrame - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
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

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.Animation#pause
     * @since 3.0.0
     *
     * @param {[type]} atFrame - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
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
        
        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.Animation#paused
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    paused: function (value)
    {
        if (value !== undefined)
        {
            //  Setter
            if (value)
            {
                return this.pause();
            }
            else
            {
                return this.resume();
            }
        }
        else
        {
            return this._paused;
        }
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.Animation#play
     * @since 3.0.0
     *
     * @param {[type]} key - [description]
     * @param {[type]} ignoreIfPlaying - [description]
     * @param {[type]} startFrame - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    play: function (key, ignoreIfPlaying, startFrame)
    {
        if (ignoreIfPlaying === undefined) { ignoreIfPlaying = false; }
        if (startFrame === undefined) { startFrame = 0; }

        if (ignoreIfPlaying && this.isPlaying && this.currentAnim.key === key)
        {
            return this;
        }

        this.load(key, startFrame);

        var anim = this.currentAnim;

        //  Should give us 9,007,199,254,740,991 safe repeats
        this.repeatCounter = (this._repeat === -1) ? Number.MAX_VALUE : this._repeat;

        anim.getFirstTick(this);

        this.forward = true;
        this.isPlaying = true;
        this.pendingRepeat = false;

        if (anim.showOnStart)
        {
            this.parent.visible = true;
        }

        if (anim.onStart)
        {
            anim.onStart.apply(anim.callbackScope, this._callbackArgs.concat(anim.onStartParams));
        }

        return this;
    },

    //  Value between 0 and 1. How far this animation is through, ignoring repeats and yoyos.
    //  If the animation has a non-zero repeat defined, progress and totalProgress will be different
    //  because progress doesn't include any repeats or repeatDelays whereas totalProgress does.
    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.Animation#progress
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    progress: function (value)
    {
        if (value === undefined)
        {
            var p = this.currentFrame.progress;

            if (!this.forward)
            {
                p = 1 - p;
            }

            return p;
        }
        else
        {
            //  TODO: Set progress

            return this;
        }
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.Animation#remove
     * @since 3.0.0
     *
     * @param {[type]} event - [description]
     */
    remove: function (event)
    {
        if (event === undefined) { event = this.currentAnim; }

        if (this.isPlaying && event.key === this.currentAnim.key)
        {
            this.stop();

            var sprite = this.parent;
            var frame = this.currentAnim.frames[0];

            this.currentFrame = frame;

            sprite.texture = frame.frame.texture;
            sprite.frame = frame.frame;
        }
    },

    //  Gets or sets the number of times that the animation should repeat
    //  after its first iteration. For example, if repeat is 1, the animation will
    //  play a total of twice (the initial play plus 1 repeat).
    //  To repeat indefinitely, use -1. repeat should always be an integer.

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.Animation#repeat
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    repeat: function (value)
    {
        if (value === undefined)
        {
            return this._repeat;
        }
        else
        {
            this._repeat = value;
            this.repeatCounter = 0;

            return this;
        }
    },

    //  Gets or sets the amount of time in seconds between repeats.
    //  For example, if repeat is 2 and repeatDelay is 1, the animation will play initially,
    //  then wait for 1 second before it repeats, then play again, then wait 1 second again
    //  before doing its final repeat.

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.Animation#repeatDelay
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    repeatDelay: function (value)
    {
        if (value === undefined)
        {
            return this._repeatDelay;
        }
        else
        {
            this._repeatDelay = value;

            return this;
        }
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.Animation#restart
     * @since 3.0.0
     *
     * @param {[type]} includeDelay - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    restart: function (includeDelay)
    {
        if (includeDelay === undefined) { includeDelay = false; }

        this.currentAnim.getFirstTick(this, includeDelay);

        this.forward = true;
        this.isPlaying = true;
        this.pendingRepeat = false;
        this._paused = false;

        //  Set frame
        this.updateFrame(this.currentAnim.frames[0]);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.Animation#resume
     * @since 3.0.0
     *
     * @param {[type]} fromFrame - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
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
        
        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.Animation#stop
     * @since 3.0.0
     *
     * @param {[type]} dispatchCallbacks - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    stop: function (dispatchCallbacks)
    {
        if (dispatchCallbacks === undefined) { dispatchCallbacks = false; }

        this.isPlaying = false;

        var anim = this.currentAnim;

        if (dispatchCallbacks && anim.onComplete)
        {
            anim.onComplete.apply(anim.callbackScope, this._callbackArgs.concat(anim.onCompleteParams));
        }

        return this;
    },

    //  Scale the time (make it go faster / slower)
    //  Factor that's used to scale time where 1 = normal speed (the default), 0.5 = half speed, 2 = double speed, etc.

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.Animation#timeScale
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    timeScale: function (value)
    {
        if (value === undefined)
        {
            return this._timeScale;
        }
        else
        {
            this._timeScale = value;

            return this;
        }
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.Animation#totalFrames
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    totalFrames: function ()
    {
        return this.currentAnim.frames.length;
    },

    //  Value between 0 and 1. How far this animation is through, including things like delays
    //  repeats, custom frame durations, etc. If the animation is set to repeat -1 it can never
    //  have a duration, therefore this will return -1.
    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.Animation#totalProgres
     * @since 3.0.0
     */
    totalProgres: function ()
    {
        // TODO
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.Animation#update
     * @since 3.0.0
     *
     * @param {[type]} timestamp - [description]
     * @param {[type]} delta - [description]
     */
    update: function (timestamp, delta)
    {
        if (!this.isPlaying || this.currentAnim.paused)
        {
            return;
        }

        this.accumulator += delta * this._timeScale;

        if (this.accumulator >= this.nextTick)
        {
            this.currentAnim.setFrame(this);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.Animation#updateFrame
     * @since 3.0.0
     *
     * @param {[type]} animationFrame - [description]
     */
    updateFrame: function (animationFrame)
    {
        var sprite = this.parent;

        this.currentFrame = animationFrame;

        sprite.texture = animationFrame.frame.texture;
        sprite.frame = animationFrame.frame;

        if (this.isPlaying)
        {
            if (animationFrame.setAlpha)
            {
                sprite.alpha = animationFrame.alpha;
            }

            var anim = this.currentAnim;

            if (anim.onUpdate)
            {
                anim.onUpdate.apply(anim.callbackScope, this._updateParams);
            }

            if (animationFrame.onUpdate)
            {
                animationFrame.onUpdate(sprite, animationFrame);
            }
        }
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.Animation#yoyo
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    yoyo: function (value)
    {
        if (value === undefined)
        {
            return this._yoyo;
        }
        else
        {
            this._yoyo = value;

            return this;
        }
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.Animation#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        //  TODO
    }

});

module.exports = Animation;
