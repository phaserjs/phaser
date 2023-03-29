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
 */
var Timeline = new Class({

    Extends: EventEmitter,

    initialize:

    function Timeline (scene, config)
    {
        EventEmitter.call(this);

        /**
         * The Scene which owns this Clock.
         *
         * @name Phaser.Time.Clock#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * The Scene Systems object of the Scene which owns this Clock.
         *
         * @name Phaser.Time.Clock#systems
         * @type {Phaser.Scenes.Systems}
         * @since 3.0.0
         */
        this.systems = scene.sys;

        this.elapsed = 0;

        /**
         * Whether the Clock is paused (`true`) or active (`false`).
         *
         * When paused, the Clock will not update any of its Timer Events, thus freezing time.
         *
         * @name Phaser.Time.Clock#paused
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.paused = true;

        /**
         * An array of all Timer Events whose delays haven't expired - these are actively updating Timer Events.
         *
         * @name Phaser.Time.Clock#_active
         * @type {Phaser.Time.TimerEvent[]}
         * @private
         * @default []
         * @since 3.0.0
        this._active = [];
        */

        this.events = [];

        var eventEmitter = this.systems.events;

        eventEmitter.on(SceneEvents.PRE_UPDATE, this.preUpdate, this);
        eventEmitter.on(SceneEvents.UPDATE, this.update, this);
        eventEmitter.once(SceneEvents.SHUTDOWN, this.shutdown, this);

        if (config)
        {
            this.add(config);
        }
    },

    /**
     * Updates the arrays of active and pending Timer Events. Called at the start of the frame.
     *
     * @method Phaser.Time.Clock#preUpdate
     * @since 3.0.0
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

    play: function (resetElapsed)
    {
        if (resetElapsed === undefined) { resetElapsed = true; }

        this.paused = false;

        if (resetElapsed)
        {
            this.elapsed = 0;
        }
    },

    /**
     * Updates the Clock's internal time and all of its Timer Events.
     *
     * @method Phaser.Time.Clock#update
     * @since 3.0.0
     *
     * @param {number} time - The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
     * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
     */
    update: function ()
    {
        if (this.paused)
        {
            return;
        }

        var events = this.events;

        for (var i = 0; i < events.length; i++)
        {
            var event = events[i];

            if (!event.complete && event.time <= this.elapsed)
            {
                event.complete = true;

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
            }
        }
    },

    /**
     * timeline.add({
     *    time: 1000,
     *    event: function () { console.log('1 second') }
     * })
     *
     * timeline.add({
     *    time: 1000,
     *    event: 'BOSS_FIGHT_START'
     * })
     *
     * //   Sets the event context to be 'target', so you can use 'this' inside of it without it having been declared yet
     * timeline.add({
     *    time: 1000,
     *    target: sprite,
     *    event: function () { this.x += 10; }
     * })
     *
     * //   Creates and runs the Tween at the given time
     * timeline.add({
     *    time: 1000,
     *    tween: TweenConfig
     *    event: () => { // optional actual as well }
     * })
     *
     * //   Plays the Animation on the target Sprite/s at the given time
     * timeline.add({
     *    time: 1000,
     *    target: sprite,
     *    play: AnimationPlayConfig
     *    event: () => { // optional actual as well }
     * })
     *
     * //   Plays the Sound at the given time
     * timeline.add({
     *    time: 1000,
     *    sound: SoundConfig
     *    event: () => { // optional actual as well }
     * })
     *
     * //   Sets the properties defined in 'set' on the target Sprite/s at the given time (no tween, direct set)
     * timeline.add({
     *    time: 1000,
     *    target: sprite[],
     *    set: { x: 100, y: 200 }
     *    event: () => { // optional actual as well }
     * })
     */
    add: function (config)
    {
        //  config can also be an array of config objects
        if (!Array.isArray(config))
        {
            config = [ config ];
        }

        var firstTime;
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

            if (firstTime === undefined)
            {
                firstTime = startTime;
            }

            //  User-defined callback that will be invoked when the event runs
            var run = GetFastValue(entry, 'run', null);

            //  User-defined event to emit when the event runs
            var event = GetFastValue(entry, 'event', null);

            var target = GetFastValue(entry, 'target', this);

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
                action: action
            });
        }

        return this;
    },

    reset: function ()
    {
        this.elapsed = 0;
    },

    /**
     * The Scene that owns this plugin is shutting down.
     * We need to kill and reset all internal properties as well as stop listening to Scene events.
     *
     * @method Phaser.Time.Clock#shutdown
     * @private
     * @since 3.0.0
     */
    shutdown: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.off(SceneEvents.PRE_UPDATE, this.preUpdate, this);
        eventEmitter.off(SceneEvents.UPDATE, this.update, this);
        eventEmitter.off(SceneEvents.SHUTDOWN, this.shutdown, this);
    },

    /**
     * The Scene that owns this plugin is being destroyed.
     * We need to shutdown and then kill off all external references.
     *
     * @method Phaser.Time.Clock#destroy
     * @private
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.shutdown();

        this.scene.sys.events.off(SceneEvents.START, this.start, this);

        this.scene = null;
        this.systems = null;
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
