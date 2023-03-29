/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var EventEmitter = require('eventemitter3');
var GameObjectFactory = require('../gameobjects/GameObjectFactory');
var GetFastValue = require('../utils/object/GetFastValue');
var SceneEvents = require('../scene/events');

/**
 * @classdesc
 *
 * @class Timeline
 * @memberof Phaser.Time
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.Scene} scene - The Scene which owns this Timeline.
 * @param {object} [config] - The configuration object for this Timeline.
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
         * An array of all the Timeline Events.
         *
         * @name Phaser.Time.Timeline#events
         * @type {object[]}
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

        this.elapsed += delta;
    },

    /**
     *
     *
     * @method Phaser.Time.Timeline#update
     * @since 3.60.0
     *
     * @param {number} time - The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
     * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
     */
    update: function (time)
    {
        if (this.paused)
        {
            return;
        }

        var i;
        var events = this.events;
        var removeSweep = false;

        for (i = 0; i < events.length; i++)
        {
            var event = events[i];

            if (!event.complete && event.time <= this.elapsed)
            {
                event.complete = true;

                if (event.once)
                {
                    removeSweep = true;
                }

                if (event.action)
                {
                    event.action.call(this, event);
                }

                if (event.event)
                {
                    this.emit(event.event, event.target);
                }

                if (event.run)
                {
                    event.run.call(event.target);
                }

                console.log(new Date().toTimeString().substring(0, 8));
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
    },

    /**
     * Starts this Timeline running.
     *
     * If the Timeline is already running and the `fromStart` parameter is `true`,
     * then calling this method will reset it the Timeline to the start.
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

        if (fromStart)
        {
            this.reset();
        }

        return this;
    },

    /**
     * Pauses this Timeline.
     *
     * To resume it again, call the `Timeline.resume` method.
     *
     * If the Timeline is paused while processing the current game step, then it
     * will carry on with all events that are due to run during that step.
     *
     * @method Phaser.Time.Timeline#pause
     * @since 3.60.0
     *
     * @return {this} This Timeline instance.
     */
    pause: function ()
    {
        this.paused = true;

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

        return this;
    },

    /**
     * Resets this Timeline back to the start.
     *
     * This will set the elapsed time to zero and set all events to be incomplete.
     *
     * @method Phaser.Time.Timeline#reset
     * @since 3.60.0
     *
     * @return {this} This Timeline instance.
     */
    reset: function ()
    {
        this.elapsed = 0;

        for (var i = 0; i < this.events.length; i++)
        {
            this.events[i].complete = false;
        }

        return this;
    },

    /**
     *
     *
     * @method Phaser.Time.Timeline#add
     * @since 3.60.0
     *
     * @param {object} config - The configuration object for this Timeline Event.
     *
     * @return {this} This Timeline instance.
     */
    add: function (config)
    {
        //  config can also be an array of config objects
        if (!Array.isArray(config))
        {
            config = [ config ];
        }

        var prevTime = 0;
        var sys = this.systems;

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

            //  User-defined callback that will be invoked when the event runs
            var run = GetFastValue(entry, 'run', null);

            //  User-defined event to emit when the event runs
            var event = GetFastValue(entry, 'event', null);

            var target = GetFastValue(entry, 'target', this);

            var once = GetFastValue(entry, 'once', false);

            //  The internal action to perform (sound, tween, animation, etc)

            var action = null;

            var tween = GetFastValue(entry, 'tween', null);
            var set = GetFastValue(entry, 'set', null);
            var sound = GetFastValue(entry, 'sound', null);

            if (tween || set || sound)
            {
                action = function ()
                {
                    if (set && target)
                    {
                        //  set is an object of key value pairs, apply them to target
                        for (var key in set)
                        {
                            target[key] = set[key];
                        }
                    }

                    if (tween)
                    {
                        sys.tweens.add(tween);
                    }

                    if (sound)
                    {
                        if (typeof sound === 'string')
                        {
                            sys.sound.play(sound);
                        }
                        else
                        {
                            sys.sound.play(sound.key, sound.config);
                        }
                    }
                };
            }

            this.events.push({
                complete: false,
                time: startTime,
                run: run,
                event: event,
                target: target,
                action: action,
                once: once
            });

            prevTime = startTime;
        }

        return this;
    },

    /**
     * Destroys this Timeline.
     *
     * This will remove all events from the Timeline and stop it from processing.
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

        this.scene = null;
        this.systems = null;
        this.events = [];
    }

});

/**
 *
 * @method Phaser.GameObjects.GameObjectFactory#timeline
 * @since 3.60.0
 *
 * @param {Phaser.Types.Tweens.TweenBuilderConfig} config - The Timeline configuration.
 *
 * @return {Phaser.Time.Timeline} The Timeline that was created.
 */
GameObjectFactory.register('timeline', function (config)
{
    return new Timeline(this.scene, config);
});

module.exports = Timeline;
