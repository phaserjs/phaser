/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var EventEmitter = require('eventemitter3');
var GameObjectFactory = require('../gameobjects/GameObjectFactory');
var GetFastValue = require('../utils/object/GetFastValue');
var SceneEvents = require('../scene/events');
var Events = require('./events');

/**
 * @classdesc
 * A Timeline is a way to schedule events to happen at specific times in the future.
 *
 * You can think of it as an event sequencer for your game, allowing you to schedule the
 * running of callbacks, events and other actions at specific times in the future.
 *
 * A Timeline is a Scene level system, meaning you can have as many Timelines as you like, each
 * belonging to a different Scene. You can also have multiple Timelines running at the same time.
 *
 * If the Scene is paused, the Timeline will also pause. If the Scene is destroyed, the Timeline
 * will be automatically destroyed. However, you can control the Timeline directly, pausing,
 * resuming and stopping it at any time.
 *
 * Create an instance of a Timeline via the Game Object Factory:
 *
 * ```js
 * const timeline = this.add.timeline();
 * ```
 *
 * The Timeline always starts paused. You must call `play` on it to start it running.
 *
 * You can also pass in a configuration object on creation, or an array of them:
 *
 * ```js
 * const timeline = this.add.timeline({
 *     at: 1000,
 *     run: () => {
 *         this.add.sprite(400, 300, 'logo');
 *     }
 * });
 *
 * timeline.play();
 * ```
 *
 * In this example we sequence a few different events:
 *
 * ```js
 * const timeline = this.add.timeline([
 *     {
 *         at: 1000,
 *         run: () => { this.logo = this.add.sprite(400, 300, 'logo'); },
 *         sound: 'TitleMusic'
 *     },
 *     {
 *         at: 2500,
 *         tween: {
 *             targets: this.logo,
 *             y: 600,
 *             yoyo: true
 *         },
 *         sound: 'Explode'
 *     },
 *     {
 *         at: 8000,
 *         event: 'HURRY_PLAYER',
 *         target: this.background,
 *         set: {
 *             tint: 0xff0000
 *         }
 *     }
 * ]);
 *
 * timeline.play();
 * ```
 *
 * The Timeline can also be looped with the repeat method:
 * ```js
 * timeline.repeat().play();
 * ```
 * 
 * There are lots of options available to you via the configuration object. See the
 * {@link Phaser.Types.Time.TimelineEventConfig} typedef for more details.
 *
 * @class Timeline
 * @extends Phaser.Events.EventEmitter
 * @memberof Phaser.Time
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.Scene} scene - The Scene which owns this Timeline.
 * @param {Phaser.Types.Time.TimelineEventConfig|Phaser.Types.Time.TimelineEventConfig[]} [config] - The configuration object for this Timeline Event, or an array of them.
 */
var Timeline = new Class({

    Extends: EventEmitter,

    initialize:

    function Timeline (scene, config)
    {
        EventEmitter.call(this);

        /**
         * The Scene to which this Timeline belongs.
         *
         * @name Phaser.Time.Timeline#scene
         * @type {Phaser.Scene}
         * @since 3.60.0
         */
        this.scene = scene;

        /**
         * A reference to the Scene Systems.
         *
         * @name Phaser.Time.Timeline#systems
         * @type {Phaser.Scenes.Systems}
         * @since 3.60.0
         */
        this.systems = scene.sys;

        /**
         * The elapsed time counter.
         *
         * Treat this as read-only.
         *
         * @name Phaser.Time.Timeline#elapsed
         * @type {number}
         * @since 3.60.0
         */
        this.elapsed = 0;

        /**
         * The Timeline's delta time scale.
         *
         * Values higher than 1 increase the speed of time, while values smaller than 1 decrease it.
         * A value of 0 freezes time and is effectively equivalent to pausing the Timeline.
         *
         * This doesn't affect the delta time scale of any Tweens created by the Timeline.
         * You will have to set the `timeScale` of each Tween or the Tween Manager if you want them to match.
         *
         * @name Phaser.Time.Timeline#timeScale
         * @type {number}
         * @default
         * @since 3.85.0
         */
        this.timeScale = 1;

        /**
         * Whether the Timeline is running (`true`) or active (`false`).
         *
         * When paused, the Timeline will not run any of its actions.
         *
         * By default a Timeline is always paused and should be started by
         * calling the `Timeline.play` method.
         *
         * You can use the `Timeline.pause` and `Timeline.resume` methods to control
         * this value in a chainable way.
         *
         * @name Phaser.Time.Timeline#paused
         * @type {boolean}
         * @default true
         * @since 3.60.0
         */
        this.paused = true;

        /**
         * Whether the Timeline is complete (`true`) or not (`false`).
         *
         * A Timeline is considered complete when all of its events have been run.
         *
         * If you wish to reset a Timeline after it has completed, you can do so
         * by calling the `Timeline.reset` method.
         *
         * You can also use the `Timeline.stop` method to stop a running Timeline,
         * at any point, without resetting it.
         *
         * @name Phaser.Time.Timeline#complete
         * @type {boolean}
         * @default false
         * @since 3.60.0
         */
        this.complete = false;

        /**
         * The total number of events that have been run.
         *
         * This value is reset to zero if the Timeline is restarted.
         *
         * Treat this as read-only.
         *
         * @name Phaser.Time.Timeline#totalComplete
         * @type {number}
         * @since 3.60.0
         */
        this.totalComplete = 0;

        /**
         * The number of times this timeline should loop.
         *
         * If this value is -1 or any negative number this Timeline will not stop. 
         *
         * @name Phaser.Time.Timeline#loop
         * @type {number}
         * @since 3.80.0
         */
        this.loop = 0;

        /**
         * The number of times this Timeline has looped.
         *
         * This value is incremented each loop if looping is enabled.
         *
         * @name Phaser.Time.Timeline#iteration
         * @type {number}
         * @since 3.80.0
         */
        this.iteration = 0;

        /**
         * An array of all the Timeline Events.
         *
         * @name Phaser.Time.Timeline#events
         * @type {Phaser.Types.Time.TimelineEvent[]}
         * @since 3.60.0
         */
        this.events = [];

        var eventEmitter = this.systems.events;

        eventEmitter.on(SceneEvents.PRE_UPDATE, this.preUpdate, this);
        eventEmitter.on(SceneEvents.UPDATE, this.update, this);
        eventEmitter.once(SceneEvents.SHUTDOWN, this.destroy, this);

        if (config)
        {
            this.add(config);
        }
    },

    /**
     * Updates the elapsed time counter, if this Timeline is not paused.
     *
     * @method Phaser.Time.Timeline#preUpdate
     * @since 3.60.0
     *
     * @param {number} time - The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
     * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
     */
    preUpdate: function (time, delta)
    {
        if (this.paused)
        {
            return;
        }

        this.elapsed += delta * this.timeScale;
    },

    /**
     * Called automatically by the Scene update step.
     *
     * Iterates through all of the Timeline Events and checks to see if they should be run.
     *
     * If they should be run, then the `TimelineEvent.action` callback is invoked.
     *
     * If the `TimelineEvent.once` property is `true` then the event is removed from the Timeline.
     *
     * If the `TimelineEvent.event` property is set then the Timeline emits that event.
     *
     * If the `TimelineEvent.run` property is set then the Timeline invokes that method.
     * 
     * If the `TimelineEvent.loop` property is set then the Timeline invokes that method when repeated.
     *
     * If the `TimelineEvent.target` property is set then the Timeline invokes the `run` method on that target.
     *
     * @method Phaser.Time.Timeline#update
     * @fires Phaser.Time.Events#COMPLETE
     * @since 3.60.0
     *
     * @param {number} time - The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
     * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
     */
    update: function ()
    {
        if (this.paused || this.complete)
        {
            return;
        }

        var i;
        var events = this.events;
        var removeSweep = false;
        var sys = this.systems;
        var target;

        for (i = 0; i < events.length; i++)
        {
            var event = events[i];

            if (!event.complete && event.time <= this.elapsed)
            {
                event.complete = true;

                this.totalComplete++;

                target = (event.target) ? event.target : this;

                if (event.if)
                {
                    if (!event.if.call(target, event))
                    {
                        continue;
                    }
                }

                if (event.once)
                {
                    removeSweep = true;
                }

                if (event.set && event.target)
                {
                    //  set is an object of key value pairs, apply them to target
                    for (var key in event.set)
                    {
                        event.target[key] = event.set[key];
                    }
                }

                if (this.iteration)
                {
                    event.repeat++;
                }

                if (event.loop && event.repeat)
                {
                    event.loop.call(target);
                }

                if (event.tween)
                {
                    event.tweenInstance = sys.tweens.add(event.tween);
                }

                if (event.sound)
                {
                    if (typeof event.sound === 'string')
                    {
                        sys.sound.play(event.sound);
                    }
                    else
                    {
                        sys.sound.play(event.sound.key, event.sound.config);
                    }
                }

                if (event.event)
                {
                    this.emit(event.event, target);
                }

                if (event.run)
                {
                    event.run.call(target);
                }

                if (event.stop)
                {
                    this.stop();
                }
            }
        }

        if (removeSweep)
        {
            for (i = 0; i < events.length; i++)
            {
                if (events[i].complete && events[i].once)
                {
                    events.splice(i, 1);

                    i--;
                }
            }
        }

        //  It may be greater than the length if events have been removed
        if (this.totalComplete >= events.length)
        {
            if (this.loop !== 0 && (this.loop === -1 || this.loop > this.iteration))
            {
                this.iteration++;

                this.reset(true);
            }
            else
            {
                this.complete = true;
            }
        }

        if (this.complete)
        {
            this.emit(Events.COMPLETE, this);
        }
    },

    /**
     * Starts this Timeline running.
     *
     * If the Timeline is already running and the `fromStart` parameter is `true`,
     * then calling this method will reset the Timeline events as incomplete.
     *
     * If you wish to resume a paused Timeline, then use the `Timeline.resume` method instead.
     *
     * @method Phaser.Time.Timeline#play
     * @since 3.60.0
     *
     * @param {boolean} [fromStart=true] - Reset this Timeline back to the start before playing.
     *
     * @return {this} This Timeline instance.
     */
    play: function (fromStart)
    {
        if (fromStart === undefined) { fromStart = true; }

        this.paused = false;
        this.complete = false;
        this.totalComplete = 0;

        if (fromStart)
        {
            this.reset();
        }

        return this;
    },

    /**
     * Pauses this Timeline.
     *
     * To resume it again, call the `Timeline.resume` method or set the `Timeline.paused` property to `false`.
     *
     * If the Timeline is paused while processing the current game step, then it
     * will carry on with all events that are due to run during that step and pause
     * from the next game step.
     *
     * Note that if any Tweens have been started prior to calling this method, they will **not** be paused as well.
     *
     * @method Phaser.Time.Timeline#pause
     * @since 3.60.0
     *
     * @return {this} This Timeline instance.
     */
    pause: function ()
    {
        this.paused = true;

        var events = this.events;

        for (var i = 0; i < events.length; i++)
        {
            var event = events[i];

            if (event.tweenInstance)
            {
                event.tweenInstance.paused = true;
            }
        }

        return this;
    },

    /**
     * Repeats this Timeline.
     *
     * If the value for `amount` is positive, the Timeline will repeat that many additional times.
     * For example a value of 1 will actually run this Timeline twice.
     * 
     * Depending on the value given, `false` is 0 and `true`, undefined and negative numbers are infinite.
     * 
     * If this Timeline had any events set to `once` that have already been removed,
     * they will **not** be repeated each loop.
     *
     * @method Phaser.Time.Timeline#repeat
     * @since 3.80.0
     * 
     * @param {number|boolean} [amount=-1] - Amount of times to repeat, if `true` or negative it will be infinite.
     *
     * @return {this} This Timeline instance.
     */
    repeat: function (amount)
    {
        if (amount === undefined || amount === true) { amount = -1; }
        if (amount === false) { amount = 0; }

        this.loop = amount;

        return this;
    },

    /**
     * Resumes this Timeline from a paused state.
     *
     * The Timeline will carry on from where it left off.
     *
     * If you need to reset the Timeline to the start, then call the `Timeline.reset` method.
     *
     * @method Phaser.Time.Timeline#resume
     * @since 3.60.0
     *
     * @return {this} This Timeline instance.
     */
    resume: function ()
    {
        this.paused = false;

        var events = this.events;

        for (var i = 0; i < events.length; i++)
        {
            var event = events[i];

            if (event.tweenInstance)
            {
                event.tweenInstance.paused = false;
            }
        }

        return this;
    },

    /**
     * Stops this Timeline.
     *
     * This will set the `paused` and `complete` properties to `true`.
     *
     * If you wish to reset the Timeline to the start, then call the `Timeline.reset` method.
     *
     * @method Phaser.Time.Timeline#stop
     * @since 3.60.0
     *
     * @return {this} This Timeline instance.
     */
    stop: function ()
    {
        this.paused = true;
        this.complete = true;

        return this;
    },

    /**
     * Resets this Timeline back to the start.
     *
     * This will set the elapsed time to zero and set all events to be incomplete.
     *
     * If the Timeline had any events that were set to `once` that have already
     * been removed, they will **not** be present again after calling this method.
     *
     * If the Timeline isn't currently running (i.e. it's paused or complete) then
     * calling this method resets those states, the same as calling `Timeline.play(true)`.
     * 
     * Any Tweens that were currently running by this Timeline will be stopped.
     *
     * @method Phaser.Time.Timeline#reset
     * @since 3.60.0
     * 
     * @param {boolean} [loop=false] - Set to true if you do not want to reset the loop counters.
     * 
     * @return {this} This Timeline instance.
     */
    reset: function (loop)
    {
        if (loop === undefined) { loop = false; }

        this.elapsed = 0;

        if (!loop)
        {
            this.iteration = 0;
        }

        var events = this.events;

        for (var i = 0; i < events.length; i++)
        {
            var event = events[i];

            event.complete = false;
            
            if (!loop)
            {
                event.repeat = 0;
            }

            if (event.tweenInstance)
            {
                event.tweenInstance.stop();
            }
        }

        return this.play(false);
    },

    /**
     * Adds one or more events to this Timeline.
     *
     * You can pass in a single configuration object, or an array of them:
     *
     * ```js
     * const timeline = this.add.timeline({
     *     at: 1000,
     *     run: () => {
     *         this.add.sprite(400, 300, 'logo');
     *     }
     * });
     * ```
     *
     * @method Phaser.Time.Timeline#add
     * @since 3.60.0
     *
     * @param {Phaser.Types.Time.TimelineEventConfig|Phaser.Types.Time.TimelineEventConfig[]} config - The configuration object for this Timeline Event, or an array of them.
     *
     * @return {this} This Timeline instance.
     */
    add: function (config)
    {
        if (!Array.isArray(config))
        {
            config = [ config ];
        }

        var events = this.events;
        var prevTime = 0;

        if (events.length > 0)
        {
            prevTime = events[events.length - 1].time;
        }

        for (var i = 0; i < config.length; i++)
        {
            var entry = config[i];

            //  Start at the exact time given, based on elapsed time (i.e. x ms from the start of the Timeline)
            var startTime = GetFastValue(entry, 'at', 0);

            //  Start in x ms from whatever the current elapsed time is (i.e. x ms from now)
            var offsetTime = GetFastValue(entry, 'in', null);

            if (offsetTime !== null)
            {
                startTime = this.elapsed + offsetTime;
            }

            //  Start in x ms from whatever the previous event's start time was (i.e. x ms after the previous event)
            var fromTime = GetFastValue(entry, 'from', null);

            if (fromTime !== null)
            {
                startTime = prevTime + fromTime;
            }

            events.push({
                complete: false,
                time: startTime,
                repeat: 0,
                if: GetFastValue(entry, 'if', null),
                run: GetFastValue(entry, 'run', null),
                loop: GetFastValue(entry, 'loop', null),
                event: GetFastValue(entry, 'event', null),
                target: GetFastValue(entry, 'target', null),
                set: GetFastValue(entry, 'set', null),
                tween: GetFastValue(entry, 'tween', null),
                sound: GetFastValue(entry, 'sound', null),
                once: GetFastValue(entry, 'once', false),
                stop: GetFastValue(entry, 'stop', false)
            });

            prevTime = startTime;
        }

        this.complete = false;

        return this;
    },

    /**
     * Removes all events from this Timeline, resets the elapsed time to zero
     * and pauses the Timeline.
     * 
     * Any Tweens that were currently running as a result of this Timeline will be stopped.
     *
     * @method Phaser.Time.Timeline#clear
     * @since 3.60.0
     *
     * @return {this} This Timeline instance.
     */
    clear: function ()
    {
        var events = this.events;

        for (var i = 0; i < events.length; i++)
        {
            var event = events[i];

            if (event.tweenInstance)
            {
                event.tweenInstance.stop();
            }
        }

        events = [];

        this.elapsed = 0;
        this.paused = true;

        return this;
    },

    /**
     * Returns `true` if this Timeline is currently playing.
     *
     * A Timeline is playing if it is not paused or not complete.
     *
     * @method Phaser.Time.Timeline#isPlaying
     * @since 3.60.0
     *
     * @return {boolean} `true` if this Timeline is playing, otherwise `false`.
     */
    isPlaying: function ()
    {
        return (!this.paused && !this.complete);
    },

    /**
     * Returns a number between 0 and 1 representing the progress of this Timeline.
     *
     * A value of 0 means the Timeline has just started, 0.5 means it's half way through,
     * and 1 means it's complete.
     *
     * If the Timeline has no events, or all events have been removed, this will return 1.
     *
     * If the Timeline is paused, this will return the progress value at the time it was paused.
     *
     * Note that the value returned is based on the number of events that have been completed,
     * not the 'duration' of the events (as this is unknown to the Timeline).
     *
     * @method Phaser.Time.Timeline#getProgress
     * @since 3.60.0
     *
     * @return {number} A number between 0 and 1 representing the progress of this Timeline.
     */
    getProgress: function ()
    {
        var total = Math.min(this.totalComplete, this.events.length);

        return total / this.events.length;
    },

    /**
     * Destroys this Timeline.
     *
     * This will remove all events from the Timeline and stop it from processing.
     * 
     * Any Tweens that were currently running as a result of this Timeline will be stopped.
     *
     * This method is called automatically when the Scene shuts down, but you may
     * also call it directly should you need to destroy the Timeline earlier.
     *
     * @method Phaser.Time.Timeline#destroy
     * @since 3.60.0
     */
    destroy: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.off(SceneEvents.PRE_UPDATE, this.preUpdate, this);
        eventEmitter.off(SceneEvents.UPDATE, this.update, this);
        eventEmitter.off(SceneEvents.SHUTDOWN, this.destroy, this);

        this.clear();

        this.scene = null;
        this.systems = null;
    }

});

/**
 * A Timeline is a way to schedule events to happen at specific times in the future.
 *
 * You can think of it as an event sequencer for your game, allowing you to schedule the
 * running of callbacks, events and other actions at specific times in the future.
 *
 * A Timeline is a Scene level system, meaning you can have as many Timelines as you like, each
 * belonging to a different Scene. You can also have multiple Timelines running at the same time.
 *
 * If the Scene is paused, the Timeline will also pause. If the Scene is destroyed, the Timeline
 * will be automatically destroyed. However, you can control the Timeline directly, pausing,
 * resuming and stopping it at any time.
 *
 * Create an instance of a Timeline via the Game Object Factory:
 *
 * ```js
 * const timeline = this.add.timeline();
 * ```
 *
 * The Timeline always starts paused. You must call `play` on it to start it running.
 *
 * You can also pass in a configuration object on creation, or an array of them:
 *
 * ```js
 * const timeline = this.add.timeline({
 *     at: 1000,
 *     run: () => {
 *         this.add.sprite(400, 300, 'logo');
 *     }
 * });
 *
 * timeline.play();
 * ```
 *
 * In this example we sequence a few different events:
 *
 * ```js
 * const timeline = this.add.timeline([
 *     {
 *         at: 1000,
 *         run: () => { this.logo = this.add.sprite(400, 300, 'logo'); },
 *         sound: 'TitleMusic'
 *     },
 *     {
 *         at: 2500,
 *         tween: {
 *             targets: this.logo,
 *             y: 600,
 *             yoyo: true
 *         },
 *         sound: 'Explode'
 *     },
 *     {
 *         at: 8000,
 *         event: 'HURRY_PLAYER',
 *         target: this.background,
 *         set: {
 *             tint: 0xff0000
 *         }
 *     }
 * ]);
 *
 * timeline.play();
 * ```
 *
 * The Timeline can also be looped with the repeat method:
 * ```js
 * timeline.repeat().play();
 * ```
 * 
 * There are lots of options available to you via the configuration object. See the
 * {@link Phaser.Types.Time.TimelineEventConfig} typedef for more details.
 *
 * @method Phaser.GameObjects.GameObjectFactory#timeline
 * @since 3.60.0
 *
 * @param {Phaser.Types.Time.TimelineEventConfig|Phaser.Types.Time.TimelineEventConfig[]} config - The configuration object for this Timeline Event, or an array of them.
 *
 * @return {Phaser.Time.Timeline} The Timeline that was created.
 */
GameObjectFactory.register('timeline', function (config)
{
    return new Timeline(this.scene, config);
});

module.exports = Timeline;
