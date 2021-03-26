/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var CustomMap = require('../structs/Map');
var GetFastValue = require('../utils/object/GetFastValue');
var Events = require('./events');
var Animation = require('./Animation');

/**
 * @classdesc
 * The Animation State Component.
 *
 * This component provides features to apply animations to Game Objects. It is responsible for
 * loading, queuing animations for later playback, mixing between animations and setting
 * the current animation frame to the Game Object that owns this component.
 *
 * This component lives as an instance within any Game Object that has it defined, such as Sprites.
 *
 * You can access its properties and methods via the `anims` property, i.e. `Sprite.anims`.
 *
 * As well as playing animations stored in the global Animation Manager, this component
 * can also create animations that are stored locally within it. See the `create` method
 * for more details.
 *
 * Prior to Phaser 3.50 this component was called just `Animation` and lived in the
 * `Phaser.GameObjects.Components` namespace. It was renamed to `AnimationState`
 * in 3.50 to help better identify its true purpose when browsing the documentation.
 *
 * @class AnimationState
 * @memberof Phaser.Animations
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} parent - The Game Object to which this animation component belongs.
 */
var AnimationState = new Class({

    initialize:

    function AnimationState (parent)
    {
        /**
         * The Game Object to which this animation component belongs.
         *
         * You can typically access this component from the Game Object
         * via the `this.anims` property.
         *
         * @name Phaser.Animations.AnimationState#parent
         * @type {Phaser.GameObjects.GameObject}
         * @since 3.0.0
         */
        this.parent = parent;

        /**
         * A reference to the global Animation Manager.
         *
         * @name Phaser.Animations.AnimationState#animationManager
         * @type {Phaser.Animations.AnimationManager}
         * @since 3.0.0
         */
        this.animationManager = parent.scene.sys.anims;

        this.animationManager.on(Events.REMOVE_ANIMATION, this.globalRemove, this);

        /**
         * A reference to the Texture Manager.
         *
         * @name Phaser.Animations.AnimationState#textureManager
         * @type {Phaser.Textures.TextureManager}
         * @protected
         * @since 3.50.0
         */
        this.textureManager = this.animationManager.textureManager;

        /**
         * The Animations stored locally in this Animation component.
         *
         * Do not modify the contents of this Map directly, instead use the
         * `add`, `create` and `remove` methods of this class instead.
         *
         * @name Phaser.Animations.AnimationState#anims
         * @type {Phaser.Structs.Map.<string, Phaser.Animations.Animation>}
         * @protected
         * @since 3.50.0
         */
        this.anims = null;

        /**
         * Is an animation currently playing or not?
         *
         * @name Phaser.Animations.AnimationState#isPlaying
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.isPlaying = false;

        /**
         * Has the current animation started playing, or is it waiting for a delay to expire?
         *
         * @name Phaser.Animations.AnimationState#hasStarted
         * @type {boolean}
         * @default false
         * @since 3.50.0
         */
        this.hasStarted = false;

        /**
         * The current Animation loaded into this Animation component.
         *
         * Will by `null` if no animation is yet loaded.
         *
         * @name Phaser.Animations.AnimationState#currentAnim
         * @type {?Phaser.Animations.Animation}
         * @default null
         * @since 3.0.0
         */
        this.currentAnim = null;

        /**
         * The current AnimationFrame being displayed by this Animation component.
         *
         * Will by `null` if no animation is yet loaded.
         *
         * @name Phaser.Animations.AnimationState#currentFrame
         * @type {?Phaser.Animations.AnimationFrame}
         * @default null
         * @since 3.0.0
         */
        this.currentFrame = null;

        /**
         * The key, instance, or config of the next Animation to be loaded into this Animation component
         * when the current animation completes.
         *
         * Will by `null` if no animation has been queued.
         *
         * @name Phaser.Animations.AnimationState#nextAnim
         * @type {?(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)}
         * @default null
         * @since 3.16.0
         */
        this.nextAnim = null;

        /**
         * A queue of Animations to be loaded into this Animation component when the current animation completes.
         *
         * Populate this queue via the `chain` method.
         *
         * @name Phaser.Animations.AnimationState#nextAnimsQueue
         * @type {array}
         * @since 3.24.0
         */
        this.nextAnimsQueue = [];

        /**
         * The Time Scale factor.
         *
         * You can adjust this value to modify the passage of time for the animation that is currently
         * playing. For example, setting it to 2 will make the animation play twice as fast. Or setting
         * it to 0.5 will slow the animation down.
         *
         * You can change this value at run-time, or set it via the `PlayAnimationConfig`.
         *
         * Prior to Phaser 3.50 this property was private and called `_timeScale`.
         *
         * @name Phaser.Animations.AnimationState#timeScale
         * @type {number}
         * @default 1
         * @since 3.50.0
         */
        this.timeScale = 1;

        /**
         * The frame rate of playback, of the current animation, in frames per second.
         *
         * This value is set when a new animation is loaded into this component and should
         * be treated as read-only, as changing it once playback has started will not alter
         * the animation. To change the frame rate, provide a new value in the `PlayAnimationConfig` object.
         *
         * @name Phaser.Animations.AnimationState#frameRate
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.frameRate = 0;

        /**
         * The duration of the current animation, in milliseconds.
         *
         * This value is set when a new animation is loaded into this component and should
         * be treated as read-only, as changing it once playback has started will not alter
         * the animation. To change the duration, provide a new value in the `PlayAnimationConfig` object.
         *
         * @name Phaser.Animations.AnimationState#duration
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.duration = 0;

        /**
         * The number of milliseconds per frame, not including frame specific modifiers that may be present in the
         * Animation data.
         *
         * This value is calculated when a new animation is loaded into this component and should
         * be treated as read-only. Changing it will not alter playback speed.
         *
         * @name Phaser.Animations.AnimationState#msPerFrame
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.msPerFrame = 0;

        /**
         * Skip frames if the time lags, or always advanced anyway?
         *
         * @name Phaser.Animations.AnimationState#skipMissedFrames
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.skipMissedFrames = true;

        /**
         * The delay before starting playback of the current animation, in milliseconds.
         *
         * This value is set when a new animation is loaded into this component and should
         * be treated as read-only, as changing it once playback has started will not alter
         * the animation. To change the delay, provide a new value in the `PlayAnimationConfig` object.
         *
         * Prior to Phaser 3.50 this property was private and called `_delay`.
         *
         * @name Phaser.Animations.AnimationState#delay
         * @type {number}
         * @default 0
         * @since 3.50.0
         */
        this.delay = 0;

        /**
         * The number of times to repeat playback of the current animation.
         *
         * If -1, it means the animation will repeat forever.
         *
         * This value is set when a new animation is loaded into this component and should
         * be treated as read-only, as changing it once playback has started will not alter
         * the animation. To change the number of repeats, provide a new value in the `PlayAnimationConfig` object.
         *
         * Prior to Phaser 3.50 this property was private and called `_repeat`.
         *
         * @name Phaser.Animations.AnimationState#repeat
         * @type {number}
         * @default 0
         * @since 3.50.0
         */
        this.repeat = 0;

        /**
         * The number of milliseconds to wait before starting the repeat playback of the current animation.
         *
         * This value is set when a new animation is loaded into this component, but can also be modified
         * at run-time.
         *
         * You can change the repeat delay by providing a new value in the `PlayAnimationConfig` object.
         *
         * Prior to Phaser 3.50 this property was private and called `_repeatDelay`.
         *
         * @name Phaser.Animations.AnimationState#repeatDelay
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.repeatDelay = 0;

        /**
         * Should the current animation yoyo? An animation that yoyos will play in reverse, from the end
         * to the start, before then repeating or completing. An animation that does not yoyo will just
         * play from the start to the end.
         *
         * This value is set when a new animation is loaded into this component, but can also be modified
         * at run-time.
         *
         * You can change the yoyo by providing a new value in the `PlayAnimationConfig` object.
         *
         * Prior to Phaser 3.50 this property was private and called `_yoyo`.
         *
         * @name Phaser.Animations.AnimationState#yoyo
         * @type {boolean}
         * @default false
         * @since 3.50.0
         */
        this.yoyo = false;

        /**
         * Should the GameObject's `visible` property be set to `true` when the animation starts to play?
         *
         * This will happen _after_ any delay that may have been set.
         *
         * This value is set when a new animation is loaded into this component, but can also be modified
         * at run-time, assuming the animation is currently delayed.
         *
         * @name Phaser.Animations.AnimationState#showOnStart
         * @type {boolean}
         * @since 3.50.0
         */
        this.showOnStart = false;

        /**
         * Should the GameObject's `visible` property be set to `false` when the animation completes?
         *
         * This value is set when a new animation is loaded into this component, but can also be modified
         * at run-time, assuming the animation is still actively playing.
         *
         * @name Phaser.Animations.AnimationState#hideOnComplete
         * @type {boolean}
         * @since 3.50.0
         */
        this.hideOnComplete = false;

        /**
         * Is the playhead moving forwards (`true`) or in reverse (`false`) ?
         *
         * @name Phaser.Animations.AnimationState#forward
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.forward = true;

        /**
         * An internal trigger that tells the component if it should plays the animation
         * in reverse mode ('true') or not ('false'). This is used because `forward` can
         * be changed by the `yoyo` feature.
         *
         * Prior to Phaser 3.50 this property was private and called `_reverse`.
         *
         * @name Phaser.Animations.AnimationState#inReverse
         * @type {boolean}
         * @default false
         * @since 3.50.0
         */
        this.inReverse = false;

        /**
         * Internal time overflow accumulator.
         *
         * This has the `delta` time added to it as part of the `update` step.
         *
         * @name Phaser.Animations.AnimationState#accumulator
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.accumulator = 0;

        /**
         * The time point at which the next animation frame will change.
         *
         * This value is compared against the `accumulator` as part of the `update` step.
         *
         * @name Phaser.Animations.AnimationState#nextTick
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.nextTick = 0;

        /**
         * A counter keeping track of how much delay time, in milliseconds, is left before playback begins.
         *
         * This is set via the `playAfterDelay` method, although it can be modified at run-time
         * if required, as long as the animation has not already started playing.
         *
         * @name Phaser.Animations.AnimationState#delayCounter
         * @type {number}
         * @default 0
         * @since 3.50.0
         */
        this.delayCounter = 0;

        /**
         * A counter that keeps track of how many repeats are left to run.
         *
         * This value is set when a new animation is loaded into this component, but can also be modified
         * at run-time.
         *
         * @name Phaser.Animations.AnimationState#repeatCounter
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.repeatCounter = 0;

        /**
         * An internal flag keeping track of pending repeats.
         *
         * @name Phaser.Animations.AnimationState#pendingRepeat
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.pendingRepeat = false;

        /**
         * Is the Animation paused?
         *
         * @name Phaser.Animations.AnimationState#_paused
         * @type {boolean}
         * @private
         * @default false
         * @since 3.0.0
         */
        this._paused = false;

        /**
         * Was the animation previously playing before being paused?
         *
         * @name Phaser.Animations.AnimationState#_wasPlaying
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
         * @name Phaser.Animations.AnimationState#_pendingStop
         * @type {number}
         * @private
         * @since 3.4.0
         */
        this._pendingStop = 0;

        /**
         * Internal property used by _pendingStop.
         *
         * @name Phaser.Animations.AnimationState#_pendingStopValue
         * @type {any}
         * @private
         * @since 3.4.0
         */
        this._pendingStopValue;
    },

    /**
     * Sets an animation, or an array of animations, to be played in the future, after the current one completes or stops.
     *
     * The current animation must enter a 'completed' state for this to happen, i.e. finish all of its repeats, delays, etc,
     * or have one of the `stop` methods called.
     *
     * An animation set to repeat forever will never enter a completed state unless stopped.
     *
     * You can chain a new animation at any point, including before the current one starts playing, during it, or when it ends (via its `animationcomplete` event).
     *
     * Chained animations are specific to a Game Object, meaning different Game Objects can have different chained animations without impacting the global animation they're playing.
     *
     * Call this method with no arguments to reset all currently chained animations.
     *
     * @method Phaser.Animations.AnimationState#chain
     * @since 3.16.0
     *
     * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig|string[]|Phaser.Animations.Animation[]|Phaser.Types.Animations.PlayAnimationConfig[])} key - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object, or an array of them.
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

        if (!Array.isArray(key))
        {
            key = [ key ];
        }

        for (var i = 0; i < key.length; i++)
        {
            var anim = key[i];

            if (this.nextAnim === null)
            {
                this.nextAnim = anim;
            }
            else
            {
                this.nextAnimsQueue.push(anim);
            }
        }

        return this.parent;
    },

    /**
     * Returns the key of the animation currently loaded into this component.
     *
     * Prior to Phaser 3.50 this method was called `getCurrentKey`.
     *
     * @method Phaser.Animations.AnimationState#getName
     * @since 3.50.0
     *
     * @return {string} The key of the Animation currently loaded into this component, or an empty string if none loaded.
     */
    getName: function ()
    {
        return (this.currentAnim) ? this.currentAnim.key : '';
    },

    /**
     * Returns the key of the animation frame currently displayed by this component.
     *
     * @method Phaser.Animations.AnimationState#getFrameName
     * @since 3.50.0
     *
     * @return {string} The key of the Animation Frame currently displayed by this component, or an empty string if no animation has been loaded.
     */
    getFrameName: function ()
    {
        return (this.currentFrame) ? this.currentFrame.textureFrame : '';
    },

    /**
     * Internal method used to load an animation into this component.
     *
     * @method Phaser.Animations.AnimationState#load
     * @protected
     * @since 3.0.0
     *
     * @param {(string|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or a `PlayAnimationConfig` object.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    load: function (key)
    {
        if (this.isPlaying)
        {
            this.stop();
        }

        var manager = this.animationManager;
        var animKey = (typeof key === 'string') ? key : GetFastValue(key, 'key', null);

        //  Get the animation, first from the local map and, if not found, from the Animation Manager
        var anim = (this.exists(animKey)) ? this.get(animKey) : manager.get(animKey);

        if (!anim)
        {
            console.warn('Missing animation: ' + animKey);
        }
        else
        {
            this.currentAnim = anim;

            //  And now override the animation values, if set in the config.

            var totalFrames = anim.getTotalFrames();
            var frameRate = GetFastValue(key, 'frameRate', anim.frameRate);
            var duration = GetFastValue(key, 'duration', anim.duration);

            anim.calculateDuration(this, totalFrames, duration, frameRate);

            this.delay = GetFastValue(key, 'delay', anim.delay);
            this.repeat = GetFastValue(key, 'repeat', anim.repeat);
            this.repeatDelay = GetFastValue(key, 'repeatDelay', anim.repeatDelay);
            this.yoyo = GetFastValue(key, 'yoyo', anim.yoyo);
            this.showOnStart = GetFastValue(key, 'showOnStart', anim.showOnStart);
            this.hideOnComplete = GetFastValue(key, 'hideOnComplete', anim.hideOnComplete);
            this.skipMissedFrames = GetFastValue(key, 'skipMissedFrames', anim.skipMissedFrames);

            this.timeScale = GetFastValue(key, 'timeScale', this.timeScale);

            var startFrame = GetFastValue(key, 'startFrame', 0);

            if (startFrame > anim.getTotalFrames())
            {
                startFrame = 0;
            }

            var frame = anim.frames[startFrame];

            if (startFrame === 0 && !this.forward)
            {
                frame = anim.getLastFrame();
            }

            this.currentFrame = frame;
        }

        return this.parent;
    },

    /**
     * Pause the current animation and set the `isPlaying` property to `false`.
     * You can optionally pause it at a specific frame.
     *
     * @method Phaser.Animations.AnimationState#pause
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
            this.setCurrentFrame(atFrame);
        }

        return this.parent;
    },

    /**
     * Resumes playback of a paused animation and sets the `isPlaying` property to `true`.
     * You can optionally tell it to start playback from a specific frame.
     *
     * @method Phaser.Animations.AnimationState#resume
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
            this.setCurrentFrame(fromFrame);
        }

        return this.parent;
    },

    /**
     * Waits for the specified delay, in milliseconds, then starts playback of the given animation.
     *
     * If the animation _also_ has a delay value set in its config, it will be **added** to the delay given here.
     *
     * If an animation is already running and a new animation is given to this method, it will wait for
     * the given delay before starting the new animation.
     *
     * If no animation is currently running, the given one begins after the delay.
     *
     * Prior to Phaser 3.50 this method was called 'delayedPlay' and the parameters were in the reverse order.
     *
     * @method Phaser.Animations.AnimationState#playAfterDelay
     * @fires Phaser.Animations.Events#ANIMATION_START
     * @since 3.50.0
     *
     * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
     * @param {number} delay - The delay, in milliseconds, to wait before starting the animation playing.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    playAfterDelay: function (key, delay)
    {
        if (!this.isPlaying)
        {
            this.delayCounter = delay;

            this.play(key, true);
        }
        else
        {
            //  If we've got a nextAnim, move it to the queue
            var nextAnim = this.nextAnim;
            var queue = this.nextAnimsQueue;

            if (nextAnim)
            {
                queue.unshift(nextAnim);
            }

            this.nextAnim = key;

            this._pendingStop = 1;
            this._pendingStopValue = delay;
        }

        return this.parent;
    },

    /**
     * Waits for the current animation to complete the `repeatCount` number of repeat cycles, then starts playback
     * of the given animation.
     *
     * You can use this to ensure there are no harsh jumps between two sets of animations, i.e. going from an
     * idle animation to a walking animation, by making them blend smoothly into each other.
     *
     * If no animation is currently running, the given one will start immediately.
     *
     * @method Phaser.Animations.AnimationState#playAfterRepeat
     * @fires Phaser.Animations.Events#ANIMATION_START
     * @since 3.50.0
     *
     * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
     * @param {number} [repeatCount=1] - How many times should the animation repeat before the next one starts?
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    playAfterRepeat: function (key, repeatCount)
    {
        if (repeatCount === undefined) { repeatCount = 1; }

        if (!this.isPlaying)
        {
            this.play(key);
        }
        else
        {
            //  If we've got a nextAnim, move it to the queue
            var nextAnim = this.nextAnim;
            var queue = this.nextAnimsQueue;

            if (nextAnim)
            {
                queue.unshift(nextAnim);
            }

            if (this.repeatCounter !== -1 && repeatCount > this.repeatCounter)
            {
                repeatCount = this.repeatCounter;
            }

            this.nextAnim = key;

            this._pendingStop = 2;
            this._pendingStopValue = repeatCount;
        }

        return this.parent;
    },

    /**
     * Start playing the given animation on this Sprite.
     *
     * Animations in Phaser can either belong to the global Animation Manager, or specifically to this Sprite.
     *
     * The benefit of a global animation is that multiple Sprites can all play the same animation, without
     * having to duplicate the data. You can just create it once and then play it on any Sprite.
     *
     * The following code shows how to create a global repeating animation. The animation will be created
     * from all of the frames within the sprite sheet that was loaded with the key 'muybridge':
     *
     * ```javascript
     * var config = {
     *     key: 'run',
     *     frames: 'muybridge',
     *     frameRate: 15,
     *     repeat: -1
     * };
     *
     * //  This code should be run from within a Scene:
     * this.anims.create(config);
     * ```
     *
     * However, if you wish to create an animation that is unique to this Sprite, and this Sprite alone,
     * you can call the `Animation.create` method instead. It accepts the exact same parameters as when
     * creating a global animation, however the resulting data is kept locally in this Sprite.
     *
     * With the animation created, either globally or locally, you can now play it on this Sprite:
     *
     * ```javascript
     * this.add.sprite(x, y).play('run');
     * ```
     *
     * Alternatively, if you wish to run it at a different frame rate, for example, you can pass a config
     * object instead:
     *
     * ```javascript
     * this.add.sprite(x, y).play({ key: 'run', frameRate: 24 });
     * ```
     *
     * When playing an animation on a Sprite it will first check to see if it can find a matching key
     * locally within the Sprite. If it can, it will play the local animation. If not, it will then
     * search the global Animation Manager and look for it there.
     *
     * If you need a Sprite to be able to play both local and global animations, make sure they don't
     * have conflicting keys.
     *
     * See the documentation for the `PlayAnimationConfig` config object for more details about this.
     *
     * Also, see the documentation in the Animation Manager for further details on creating animations.
     *
     * @method Phaser.Animations.AnimationState#play
     * @fires Phaser.Animations.Events#ANIMATION_START
     * @since 3.0.0
     *
     * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
     * @param {boolean} [ignoreIfPlaying=false] - If this animation is already playing then ignore this call.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    play: function (key, ignoreIfPlaying)
    {
        if (ignoreIfPlaying === undefined) { ignoreIfPlaying = false; }

        var currentAnim = this.currentAnim;
        var parent = this.parent;

        //  Must be either an Animation instance, or a PlayAnimationConfig object
        var animKey = (typeof key === 'string') ? key : key.key;

        if (ignoreIfPlaying && this.isPlaying && currentAnim.key === animKey)
        {
            return parent;
        }

        //  Are we mixing?
        if (currentAnim && this.isPlaying)
        {
            var mix = this.animationManager.getMix(currentAnim.key, key);

            if (mix > 0)
            {
                return this.playAfterDelay(key, mix);
            }
        }

        this.forward = true;
        this.inReverse = false;

        this._paused = false;
        this._wasPlaying = true;

        return this.startAnimation(key);
    },

    /**
     * Start playing the given animation on this Sprite, in reverse.
     *
     * Animations in Phaser can either belong to the global Animation Manager, or specifically to this Sprite.
     *
     * The benefit of a global animation is that multiple Sprites can all play the same animation, without
     * having to duplicate the data. You can just create it once and then play it on any Sprite.
     *
     * The following code shows how to create a global repeating animation. The animation will be created
     * from all of the frames within the sprite sheet that was loaded with the key 'muybridge':
     *
     * ```javascript
     * var config = {
     *     key: 'run',
     *     frames: 'muybridge',
     *     frameRate: 15,
     *     repeat: -1
     * };
     *
     * //  This code should be run from within a Scene:
     * this.anims.create(config);
     * ```
     *
     * However, if you wish to create an animation that is unique to this Sprite, and this Sprite alone,
     * you can call the `Animation.create` method instead. It accepts the exact same parameters as when
     * creating a global animation, however the resulting data is kept locally in this Sprite.
     *
     * With the animation created, either globally or locally, you can now play it on this Sprite:
     *
     * ```javascript
     * this.add.sprite(x, y).playReverse('run');
     * ```
     *
     * Alternatively, if you wish to run it at a different frame rate, for example, you can pass a config
     * object instead:
     *
     * ```javascript
     * this.add.sprite(x, y).playReverse({ key: 'run', frameRate: 24 });
     * ```
     *
     * When playing an animation on a Sprite it will first check to see if it can find a matching key
     * locally within the Sprite. If it can, it will play the local animation. If not, it will then
     * search the global Animation Manager and look for it there.
     *
     * If you need a Sprite to be able to play both local and global animations, make sure they don't
     * have conflicting keys.
     *
     * See the documentation for the `PlayAnimationConfig` config object for more details about this.
     *
     * Also, see the documentation in the Animation Manager for further details on creating animations.
     *
     * @method Phaser.Animations.AnimationState#playReverse
     * @fires Phaser.Animations.Events#ANIMATION_START
     * @since 3.12.0
     *
     * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
     * @param {boolean} [ignoreIfPlaying=false] - If an animation is already playing then ignore this call.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    playReverse: function (key, ignoreIfPlaying)
    {
        if (ignoreIfPlaying === undefined) { ignoreIfPlaying = false; }

        //  Must be either an Animation instance, or a PlayAnimationConfig object
        var animKey = (typeof key === 'string') ? key : key.key;

        if (ignoreIfPlaying && this.isPlaying && this.currentAnim.key === animKey)
        {
            return this.parent;
        }

        this.forward = false;
        this.inReverse = true;

        this._paused = false;
        this._wasPlaying = true;

        return this.startAnimation(key);
    },

    /**
     * Load the animation based on the key and set-up all of the internal values
     * needed for playback to start. If there is no delay, it will also fire the start events.
     *
     * @method Phaser.Animations.AnimationState#startAnimation
     * @fires Phaser.Animations.Events#ANIMATION_START
     * @since 3.50.0
     *
     * @param {(string|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or a `PlayAnimationConfig` object.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    startAnimation: function (key)
    {
        this.load(key);

        var anim = this.currentAnim;
        var gameObject = this.parent;

        if (!anim)
        {
            return gameObject;
        }

        //  Should give us 9,007,199,254,740,991 safe repeats
        this.repeatCounter = (this.repeat === -1) ? Number.MAX_VALUE : this.repeat;

        anim.getFirstTick(this);

        this.isPlaying = true;
        this.pendingRepeat = false;
        this.hasStarted = false;

        this._pendingStop = 0;
        this._pendingStopValue = 0;
        this._paused = false;

        //  Add any delay the animation itself may have had as well
        this.delayCounter += this.delay;

        if (this.delayCounter === 0)
        {
            this.handleStart();
        }

        return gameObject;
    },

    /**
     * Handles the start of an animation playback.
     *
     * @method Phaser.Animations.AnimationState#handleStart
     * @private
     * @since 3.50.0
     */
    handleStart: function ()
    {
        if (this.showOnStart)
        {
            this.parent.setVisible(true);
        }

        this.setCurrentFrame(this.currentFrame);

        this.hasStarted = true;

        this.emitEvents(Events.ANIMATION_START);
    },

    /**
     * Handles the repeat of an animation.
     *
     * @method Phaser.Animations.AnimationState#handleRepeat
     * @private
     * @since 3.50.0
     */
    handleRepeat: function ()
    {
        this.pendingRepeat = false;

        this.emitEvents(Events.ANIMATION_REPEAT);
    },

    /**
     * Handles the stop of an animation playback.
     *
     * @method Phaser.Animations.AnimationState#handleStop
     * @private
     * @since 3.50.0
     */
    handleStop: function ()
    {
        this._pendingStop = 0;

        this.isPlaying = false;

        this.emitEvents(Events.ANIMATION_STOP);
    },

    /**
     * Handles the completion of an animation playback.
     *
     * @method Phaser.Animations.AnimationState#handleComplete
     * @private
     * @since 3.50.0
     */
    handleComplete: function ()
    {
        this._pendingStop = 0;

        this.isPlaying = false;

        if (this.hideOnComplete)
        {
            this.parent.setVisible(false);
        }

        this.emitEvents(Events.ANIMATION_COMPLETE, Events.ANIMATION_COMPLETE_KEY);
    },

    /**
     * Fires the given animation event.
     *
     * @method Phaser.Animations.AnimationState#emitEvents
     * @private
     * @since 3.50.0
     *
     * @param {string} event - The Animation Event to dispatch.
     */
    emitEvents: function (event, keyEvent)
    {
        var anim = this.currentAnim;
        var frame = this.currentFrame;
        var gameObject = this.parent;

        var frameKey = frame.textureFrame;

        gameObject.emit(event, anim, frame, gameObject, frameKey);

        if (keyEvent)
        {
            gameObject.emit(keyEvent + anim.key, anim, frame, gameObject, frameKey);
        }
    },

    /**
     * Reverse the Animation that is already playing on the Game Object.
     *
     * @method Phaser.Animations.AnimationState#reverse
     * @since 3.12.0
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    reverse: function ()
    {
        if (this.isPlaying)
        {
            this.inReverse = !this.inReverse;

            this.forward = !this.forward;
        }

        return this.parent;
    },

    /**
     * Returns a value between 0 and 1 indicating how far this animation is through, ignoring repeats and yoyos.
     *
     * The value is based on the current frame and how far that is in the animation, it is not based on
     * the duration of the animation.
     *
     * @method Phaser.Animations.AnimationState#getProgress
     * @since 3.4.0
     *
     * @return {number} The progress of the current animation in frames, between 0 and 1.
     */
    getProgress: function ()
    {
        var frame = this.currentFrame;

        if (!frame)
        {
            return 0;
        }

        var p = frame.progress;

        if (this.inReverse)
        {
            p *= -1;
        }

        return p;
    },

    /**
     * Takes a value between 0 and 1 and uses it to set how far this animation is through playback.
     *
     * Does not factor in repeats or yoyos, but does handle playing forwards or backwards.
     *
     * The value is based on the current frame and how far that is in the animation, it is not based on
     * the duration of the animation.
     *
     * @method Phaser.Animations.AnimationState#setProgress
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
     * Sets the number of times that the animation should repeat after its first play through.
     * For example, if repeat is 1, the animation will play a total of twice: the initial play plus 1 repeat.
     *
     * To repeat indefinitely, use -1.
     * The value should always be an integer.
     *
     * Calling this method only works if the animation is already running. Otherwise, any
     * value specified here will be overwritten when the next animation loads in. To avoid this,
     * use the `repeat` property of the `PlayAnimationConfig` object instead.
     *
     * @method Phaser.Animations.AnimationState#setRepeat
     * @since 3.4.0
     *
     * @param {number} value - The number of times that the animation should repeat.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    setRepeat: function (value)
    {
        this.repeatCounter = (value === -1) ? Number.MAX_VALUE : value;

        return this.parent;
    },

    /**
     * Handle the removal of an animation from the Animation Manager.
     *
     * @method Phaser.Animations.AnimationState#globalRemove
     * @since 3.50.0
     *
     * @param {string} [key] - The key of the removed Animation.
     * @param {Phaser.Animations.Animation} [animation] - The removed Animation.
     */
    globalRemove: function (key, animation)
    {
        if (animation === undefined) { animation = this.currentAnim; }

        if (this.isPlaying && animation.key === this.currentAnim.key)
        {
            this.stop();

            this.setCurrentFrame(this.currentAnim.frames[0]);
        }
    },

    /**
     * Restarts the current animation from its beginning.
     *
     * You can optionally reset the delay and repeat counters as well.
     *
     * Calling this will fire the `ANIMATION_RESTART` event immediately.
     *
     * If you `includeDelay` then it will also fire the `ANIMATION_START` event once
     * the delay has expired, otherwise, playback will just begin immediately.
     *
     * @method Phaser.Animations.AnimationState#restart
     * @fires Phaser.Animations.Events#ANIMATION_RESTART
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
        var gameObject = this.parent;

        if (!anim)
        {
            return gameObject;
        }

        if (resetRepeats)
        {
            this.repeatCounter = (this.repeat === -1) ? Number.MAX_VALUE : this.repeat;
        }

        anim.getFirstTick(this);

        this.emitEvents(Events.ANIMATION_RESTART);

        this.isPlaying = true;
        this.pendingRepeat = false;

        //  Set this to `true` if there is no delay to include, so it skips the `hasStarted` check in `update`.
        this.hasStarted = !includeDelay;

        this._pendingStop = 0;
        this._pendingStopValue = 0;
        this._paused = false;

        this.setCurrentFrame(anim.frames[0]);

        return this.parent;
    },

    /**
     * The current animation has completed. This dispatches the `ANIMATION_COMPLETE` event.
     *
     * This method is called by the Animation instance and should not usually be invoked directly.
     *
     * If no animation is loaded, no events will be dispatched.
     *
     * If another animation has been queued for playback, it will be started after the events fire.
     *
     * @method Phaser.Animations.AnimationState#complete
     * @fires Phaser.Animations.Events#ANIMATION_COMPLETE
     * @since 3.50.0
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    complete: function ()
    {
        this._pendingStop = 0;

        this.isPlaying = false;

        if (this.currentAnim)
        {
            this.handleComplete();
        }

        if (this.nextAnim)
        {
            var key = this.nextAnim;

            this.nextAnim = (this.nextAnimsQueue.length > 0) ? this.nextAnimsQueue.shift() : null;

            this.play(key);
        }

        return this.parent;
    },

    /**
     * Immediately stops the current animation from playing and dispatches the `ANIMATION_STOP` event.
     *
     * If no animation is running, no events will be dispatched.
     *
     * If there is another animation in the queue (set via the `chain` method) then it will start playing.
     *
     * @method Phaser.Animations.AnimationState#stop
     * @fires Phaser.Animations.Events#ANIMATION_STOP
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    stop: function ()
    {
        this._pendingStop = 0;

        this.isPlaying = false;

        if (this.currentAnim)
        {
            this.handleStop();
        }

        if (this.nextAnim)
        {
            var key = this.nextAnim;

            this.nextAnim = this.nextAnimsQueue.shift();

            this.play(key);
        }

        return this.parent;
    },

    /**
     * Stops the current animation from playing after the specified time delay, given in milliseconds.
     *
     * It then dispatches the `ANIMATION_STOP` event.
     *
     * If no animation is running, no events will be dispatched.
     *
     * If there is another animation in the queue (set via the `chain` method) then it will start playing,
     * when the current one stops.
     *
     * @method Phaser.Animations.AnimationState#stopAfterDelay
     * @fires Phaser.Animations.Events#ANIMATION_STOP
     * @since 3.4.0
     *
     * @param {number} delay - The number of milliseconds to wait before stopping this animation.
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
     * It then dispatches the `ANIMATION_STOP` event.
     *
     * If no animation is running, no events will be dispatched.
     *
     * If there is another animation in the queue (set via the `chain` method) then it will start playing,
     * when the current one stops.
     *
     * Prior to Phaser 3.50 this method was called `stopOnRepeat` and had no parameters.
     *
     * @method Phaser.Animations.AnimationState#stopAfterRepeat
     * @fires Phaser.Animations.Events#ANIMATION_STOP
     * @since 3.50.0
     *
     * @param {number} [repeatCount=1] - How many times should the animation repeat before stopping?
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    stopAfterRepeat: function (repeatCount)
    {
        if (repeatCount === undefined) { repeatCount = 1; }

        if (this.repeatCounter !== -1 && repeatCount > this.repeatCounter)
        {
            repeatCount = this.repeatCounter;
        }

        this._pendingStop = 2;
        this._pendingStopValue = repeatCount;

        return this.parent;
    },

    /**
     * Stops the current animation from playing when it next sets the given frame.
     * If this frame doesn't exist within the animation it will not stop it from playing.
     *
     * It then dispatches the `ANIMATION_STOP` event.
     *
     * If no animation is running, no events will be dispatched.
     *
     * If there is another animation in the queue (set via the `chain` method) then it will start playing,
     * when the current one stops.
     *
     * @method Phaser.Animations.AnimationState#stopOnFrame
     * @fires Phaser.Animations.Events#ANIMATION_STOP
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
     * Returns the total number of frames in this animation, or returns zero if no
     * animation has been loaded.
     *
     * @method Phaser.Animations.AnimationState#getTotalFrames
     * @since 3.4.0
     *
     * @return {number} The total number of frames in the current animation, or zero if no animation has been loaded.
     */
    getTotalFrames: function ()
    {
        return (this.currentAnim) ? this.currentAnim.getTotalFrames() : 0;
    },

    /**
     * The internal update loop for the AnimationState Component.
     *
     * This is called automatically by the `Sprite.preUpdate` method.
     *
     * @method Phaser.Animations.AnimationState#update
     * @since 3.0.0
     *
     * @param {number} time - The current timestamp.
     * @param {number} delta - The delta time, in ms, elapsed since the last frame.
     */
    update: function (time, delta)
    {
        var anim = this.currentAnim;

        if (!this.isPlaying || !anim || anim.paused)
        {
            return;
        }

        this.accumulator += delta * this.timeScale;

        if (this._pendingStop === 1)
        {
            this._pendingStopValue -= delta;

            if (this._pendingStopValue <= 0)
            {
                return this.stop();
            }
        }

        if (!this.hasStarted)
        {
            if (this.accumulator >= this.delayCounter)
            {
                this.accumulator -= this.delayCounter;

                this.handleStart();
            }
        }
        else if (this.accumulator >= this.nextTick)
        {
            //  Process one frame advance as standard

            if (this.forward)
            {
                anim.nextFrame(this);
            }
            else
            {
                anim.previousFrame(this);
            }

            //  And only do more if we're skipping frames and have time left
            if (this.isPlaying && this._pendingStop === 0 && this.skipMissedFrames && this.accumulator > this.nextTick)
            {
                var safetyNet = 0;

                do
                {
                    if (this.forward)
                    {
                        anim.nextFrame(this);
                    }
                    else
                    {
                        anim.previousFrame(this);
                    }

                    safetyNet++;

                } while (this.isPlaying && this.accumulator > this.nextTick && safetyNet < 60);
            }
        }
    },

    /**
     * Sets the given Animation Frame as being the current frame
     * and applies it to the parent Game Object, adjusting size and origin as needed.
     *
     * @method Phaser.Animations.AnimationState#setCurrentFrame
     * @fires Phaser.Animations.Events#ANIMATION_UPDATE
     * @fires Phaser.Animations.Events#ANIMATION_STOP
     * @since 3.4.0
     *
     * @param {Phaser.Animations.AnimationFrame} animationFrame - The animation frame to change to.
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

        if (animationFrame.setAlpha)
        {
            gameObject.alpha = animationFrame.alpha;
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

        if (this.isPlaying && this.hasStarted)
        {
            this.emitEvents(Events.ANIMATION_UPDATE);

            if (this._pendingStop === 3 && this._pendingStopValue === animationFrame)
            {
                this.stop();
            }
        }

        return gameObject;
    },

    /**
     * Advances the animation to the next frame, regardless of the time or animation state.
     * If the animation is set to repeat, or yoyo, this will still take effect.
     *
     * Calling this does not change the direction of the animation. I.e. if it was currently
     * playing in reverse, calling this method doesn't then change the direction to forwards.
     *
     * @method Phaser.Animations.AnimationState#nextFrame
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
     * @method Phaser.Animations.AnimationState#previousFrame
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
     * Get an Animation instance that has been created locally on this Sprite.
     *
     * See the `create` method for more details.
     *
     * @method Phaser.Animations.AnimationState#get
     * @since 3.50.0
     *
     * @param {string} key - The key of the Animation to retrieve.
     *
     * @return {Phaser.Animations.Animation} The Animation, or `null` if the key is invalid.
     */
    get: function (key)
    {
        return (this.anims) ? this.anims.get(key) : null;
    },

    /**
     * Checks to see if the given key is already used locally within the animations stored on this Sprite.
     *
     * @method Phaser.Animations.AnimationState#exists
     * @since 3.50.0
     *
     * @param {string} key - The key of the Animation to check.
     *
     * @return {boolean} `true` if the Animation exists locally, or `false` if the key is available, or there are no local animations.
     */
    exists: function (key)
    {
        return (this.anims) ? this.anims.has(key) : false;
    },

    /**
     * Creates a new Animation that is local specifically to this Sprite.
     *
     * When a Sprite owns an animation, it is kept out of the global Animation Manager, which means
     * you're free to use keys that may be already defined there. Unless you specifically need a Sprite
     * to have a unique animation, you should favor using global animations instead, as they allow for
     * the same animation to be used across multiple Sprites, saving on memory. However, if this Sprite
     * is the only one to use this animation, it's sensible to create it here.
     *
     * If an invalid key is given this method will return `false`.
     *
     * If you pass the key of an animation that already exists locally, that animation will be returned.
     *
     * A brand new animation is only created if the key is valid and not already in use by this Sprite.
     *
     * If you wish to re-use an existing key, call the `remove` method first, then this method.
     *
     * @method Phaser.Animations.AnimationState#create
     * @since 3.50.0
     *
     * @param {Phaser.Types.Animations.Animation} config - The configuration settings for the Animation.
     *
     * @return {(Phaser.Animations.Animation|false)} The Animation that was created, or `false` if the key is already in use.
     */
    create: function (config)
    {
        var key = config.key;

        var anim = false;

        if (key)
        {
            anim = this.get(key);

            if (!anim)
            {
                anim = new Animation(this, key, config);

                if (!this.anims)
                {
                    this.anims = new CustomMap();
                }

                this.anims.set(key, anim);
            }
        }

        return anim;
    },

    /**
     * Generate an array of {@link Phaser.Types.Animations.AnimationFrame} objects from a texture key and configuration object.
     *
     * Generates objects with string based frame names, as configured by the given {@link Phaser.Types.Animations.GenerateFrameNames}.
     *
     * It's a helper method, designed to make it easier for you to extract all of the frame names from texture atlases.
     * If you're working with a sprite sheet, see the `generateFrameNumbers` method instead.
     *
     * Example:
     *
     * If you have a texture atlases loaded called `gems` and it contains 6 frames called `ruby_0001`, `ruby_0002`, and so on,
     * then you can call this method using: `this.anims.generateFrameNames('gems', { prefix: 'ruby_', end: 6, zeroPad: 4 })`.
     *
     * The `end` value tells it to look for 6 frames, incrementally numbered, all starting with the prefix `ruby_`. The `zeroPad`
     * value tells it how many zeroes pad out the numbers. To create an animation using this method, you can do:
     *
     * ```javascript
     * this.anims.create({
     *   key: 'ruby',
     *   repeat: -1,
     *   frames: this.anims.generateFrameNames('gems', {
     *     prefix: 'ruby_',
     *     end: 6,
     *     zeroPad: 4
     *   })
     * });
     * ```
     *
     * Please see the animation examples for further details.
     *
     * @method Phaser.Animations.AnimationState#generateFrameNames
     * @since 3.50.0
     *
     * @param {string} key - The key for the texture containing the animation frames.
     * @param {Phaser.Types.Animations.GenerateFrameNames} [config] - The configuration object for the animation frame names.
     *
     * @return {Phaser.Types.Animations.AnimationFrame[]} The array of {@link Phaser.Types.Animations.AnimationFrame} objects.
     */
    generateFrameNames: function (key, config)
    {
        return this.animationManager.generateFrameNames(key, config);
    },

    /**
     * Generate an array of {@link Phaser.Types.Animations.AnimationFrame} objects from a texture key and configuration object.
     *
     * Generates objects with numbered frame names, as configured by the given {@link Phaser.Types.Animations.GenerateFrameNumbers}.
     *
     * If you're working with a texture atlas, see the `generateFrameNames` method instead.
     *
     * It's a helper method, designed to make it easier for you to extract frames from sprite sheets.
     * If you're working with a texture atlas, see the `generateFrameNames` method instead.
     *
     * Example:
     *
     * If you have a sprite sheet loaded called `explosion` and it contains 12 frames, then you can call this method using:
     * `this.anims.generateFrameNumbers('explosion', { start: 0, end: 12 })`.
     *
     * The `end` value tells it to stop after 12 frames. To create an animation using this method, you can do:
     *
     * ```javascript
     * this.anims.create({
     *   key: 'boom',
     *   frames: this.anims.generateFrameNames('explosion', {
     *     start: 0,
     *     end: 12
     *   })
     * });
     * ```
     *
     * Note that `start` is optional and you don't need to include it if the animation starts from frame 0.
     *
     * To specify an animation in reverse, swap the `start` and `end` values.
     *
     * If the frames are not sequential, you may pass an array of frame numbers instead, for example:
     *
     * `this.anims.generateFrameNumbers('explosion', { frames: [ 0, 1, 2, 1, 2, 3, 4, 0, 1, 2 ] })`
     *
     * Please see the animation examples and `GenerateFrameNumbers` config docs for further details.
     *
     * @method Phaser.Animations.AnimationState#generateFrameNumbers
     * @since 3.50.0
     *
     * @param {string} key - The key for the texture containing the animation frames.
     * @param {Phaser.Types.Animations.GenerateFrameNumbers} config - The configuration object for the animation frames.
     *
     * @return {Phaser.Types.Animations.AnimationFrame[]} The array of {@link Phaser.Types.Animations.AnimationFrame} objects.
     */
    generateFrameNumbers: function (key, config)
    {
        return this.animationManager.generateFrameNumbers(key, config);
    },

    /**
     * Removes a locally created Animation from this Sprite, based on the given key.
     *
     * Once an Animation has been removed, this Sprite cannot play it again without re-creating it.
     *
     * @method Phaser.Animations.AnimationState#remove
     * @since 3.50.0
     *
     * @param {string} key - The key of the animation to remove.
     *
     * @return {Phaser.Animations.Animation} The Animation instance that was removed from this Sprite, if the key was valid.
     */
    remove: function (key)
    {
        var anim = this.get(key);

        if (anim)
        {
            if (this.currentAnim === anim)
            {
                this.stop();
            }

            this.anims.delete(key);
        }

        return anim;
    },

    /**
     * Destroy this Animation component.
     *
     * Unregisters event listeners and cleans up its references.
     *
     * @method Phaser.Animations.AnimationState#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.animationManager.off(Events.REMOVE_ANIMATION, this.globalRemove, this);

        if (this.anims)
        {
            this.anims.clear();
        }

        this.animationManager = null;
        this.parent = null;
        this.nextAnim = null;
        this.nextAnimsQueue.length = 0;

        this.currentAnim = null;
        this.currentFrame = null;
    },

    /**
     * `true` if the current animation is paused, otherwise `false`.
     *
     * @name Phaser.Animations.AnimationState#isPaused
     * @readonly
     * @type {boolean}
     * @since 3.4.0
     */
    isPaused: {

        get: function ()
        {
            return this._paused;
        }

    }

});

module.exports = AnimationState;
