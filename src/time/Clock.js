/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var PluginCache = require('../plugins/PluginCache');
var SceneEvents = require('../scene/events');
var TimerEvent = require('./TimerEvent');
var Remove = require('../utils/array/Remove');

/**
 * @classdesc
 * The Clock is a Scene plugin which creates and updates Timer Events for its Scene.
 *
 * @class Clock
 * @memberof Phaser.Time
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene which owns this Clock.
 */
var Clock = new Class({

    initialize:

    function Clock (scene)
    {
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

        /**
         * The current time of the Clock, in milliseconds.
         *
         * If accessed externally, this is equivalent to the `time` parameter normally passed to a Scene's `update` method.
         *
         * @name Phaser.Time.Clock#now
         * @type {number}
         * @since 3.0.0
         */
        this.now = 0;

        /**
         * The scale of the Clock's time delta.
         *
         * The time delta is the time elapsed between two consecutive frames and influences the speed of time for this Clock and anything which uses it, such as its Timer Events. Values higher than 1 increase the speed of time, while values smaller than 1 decrease it. A value of 0 freezes time and is effectively equivalent to pausing the Clock.
         *
         * @name Phaser.Time.Clock#timeScale
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.timeScale = 1;

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
        this.paused = false;

        /**
         * An array of all Timer Events whose delays haven't expired - these are actively updating Timer Events.
         *
         * @name Phaser.Time.Clock#_active
         * @type {Phaser.Time.TimerEvent[]}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._active = [];

        /**
         * An array of all Timer Events which will be added to the Clock at the start of the next frame.
         *
         * @name Phaser.Time.Clock#_pendingInsertion
         * @type {Phaser.Time.TimerEvent[]}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._pendingInsertion = [];

        /**
         * An array of all Timer Events which will be removed from the Clock at the start of the next frame.
         *
         * @name Phaser.Time.Clock#_pendingRemoval
         * @type {Phaser.Time.TimerEvent[]}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._pendingRemoval = [];

        scene.sys.events.once(SceneEvents.BOOT, this.boot, this);
        scene.sys.events.on(SceneEvents.START, this.start, this);
    },

    /**
     * This method is called automatically, only once, when the Scene is first created.
     * Do not invoke it directly.
     *
     * @method Phaser.Time.Clock#boot
     * @private
     * @since 3.5.1
     */
    boot: function ()
    {
        //  Sync with the TimeStep
        this.now = this.systems.game.loop.time;

        this.systems.events.once(SceneEvents.DESTROY, this.destroy, this);
    },

    /**
     * This method is called automatically by the Scene when it is starting up.
     * It is responsible for creating local systems, properties and listening for Scene events.
     * Do not invoke it directly.
     *
     * @method Phaser.Time.Clock#start
     * @private
     * @since 3.5.0
     */
    start: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.on(SceneEvents.PRE_UPDATE, this.preUpdate, this);
        eventEmitter.on(SceneEvents.UPDATE, this.update, this);
        eventEmitter.once(SceneEvents.SHUTDOWN, this.shutdown, this);
    },

    /**
     * Creates a Timer Event and adds it to this Clock at the start of the next frame.
     *
     * You can pass in either a `TimerEventConfig` object, from with a new `TimerEvent` will
     * be created, or you can pass in a `TimerEvent` instance.
     *
     * If passing an instance please make sure that this instance hasn't been used before.
     * If it has ever entered a 'completed' state then it will no longer be suitable to
     * run again.
     *
     * Also, if the `TimerEvent` instance is being used by _another_ Clock (in another Scene)
     * it will still be updated by that Clock as well, so be careful when using this feature.
     *
     * @method Phaser.Time.Clock#addEvent
     * @since 3.0.0
     *
     * @param {(Phaser.Time.TimerEvent | Phaser.Types.Time.TimerEventConfig)} config - The configuration for the Timer Event, or an existing Timer Event object.
     *
     * @return {Phaser.Time.TimerEvent} The Timer Event which was created, or passed in.
     */
    addEvent: function (config)
    {
        var event;

        if (config instanceof TimerEvent)
        {
            event = config;

            this.removeEvent(event);

            event.elapsed = event.startAt;
            event.hasDispatched = false;
            event.repeatCount = (event.repeat === -1 || event.loop) ? 999999999999 : event.repeat;
        }
        else
        {
            event = new TimerEvent(config);
        }

        this._pendingInsertion.push(event);

        return event;
    },

    /**
     * Creates a Timer Event and adds it to the Clock at the start of the frame.
     *
     * This is a shortcut for {@link #addEvent} which can be shorter and is compatible with the syntax of the GreenSock Animation Platform (GSAP).
     *
     * @method Phaser.Time.Clock#delayedCall
     * @since 3.0.0
     *
     * @param {number} delay - The delay of the function call, in milliseconds.
     * @param {function} callback - The function to call after the delay expires.
     * @param {Array.<*>} [args] - The arguments to call the function with.
     * @param {*} [callbackScope] - The scope (`this` object) to call the function with.
     *
     * @return {Phaser.Time.TimerEvent} The Timer Event which was created.
     */
    delayedCall: function (delay, callback, args, callbackScope)
    {
        return this.addEvent({ delay: delay, callback: callback, args: args, callbackScope: callbackScope });
    },

    /**
     * Clears and recreates the array of pending Timer Events.
     *
     * @method Phaser.Time.Clock#clearPendingEvents
     * @since 3.0.0
     *
     * @return {this} - This Clock instance.
     */
    clearPendingEvents: function ()
    {
        this._pendingInsertion = [];

        return this;
    },

    /**
     * Removes the given Timer Event, or an array of Timer Events, from this Clock.
     *
     * The events are removed from all internal lists (active, pending and removal),
     * freeing the event up to be re-used.
     *
     * @method Phaser.Time.Clock#removeEvent
     * @since 3.50.0
     *
     * @param {(Phaser.Time.TimerEvent | Phaser.Time.TimerEvent[])} events - The Timer Event, or an array of Timer Events, to remove from this Clock.
     *
     * @return {this} - This Clock instance.
     */
    removeEvent: function (events)
    {
        if (!Array.isArray(events))
        {
            events = [ events ];
        }

        for (var i = 0; i < events.length; i++)
        {
            var event = events[i];

            Remove(this._pendingRemoval, event);
            Remove(this._pendingInsertion, event);
            Remove(this._active, event);
        }

        return this;
    },

    /**
     * Schedules all active Timer Events for removal at the start of the frame.
     *
     * @method Phaser.Time.Clock#removeAllEvents
     * @since 3.0.0
     *
     * @return {this} - This Clock instance.
     */
    removeAllEvents: function ()
    {
        this._pendingRemoval = this._pendingRemoval.concat(this._active);

        return this;
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
    preUpdate: function ()
    {
        var toRemove = this._pendingRemoval.length;
        var toInsert = this._pendingInsertion.length;

        if (toRemove === 0 && toInsert === 0)
        {
            //  Quick bail
            return;
        }

        var i;
        var event;

        //  Delete old events
        for (i = 0; i < toRemove; i++)
        {
            event = this._pendingRemoval[i];

            var index = this._active.indexOf(event);

            if (index > -1)
            {
                this._active.splice(index, 1);
            }

            //  Pool them?
            event.destroy();
        }

        for (i = 0; i < toInsert; i++)
        {
            event = this._pendingInsertion[i];

            this._active.push(event);
        }

        //  Clear the lists
        this._pendingRemoval.length = 0;
        this._pendingInsertion.length = 0;
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
    update: function (time, delta)
    {
        this.now = time;

        if (this.paused)
        {
            return;
        }

        delta *= this.timeScale;

        for (var i = 0; i < this._active.length; i++)
        {
            var event = this._active[i];

            if (event.paused)
            {
                continue;
            }

            //  Use delta time to increase elapsed.
            //  Avoids needing to adjust for pause / resume.
            //  Automatically smoothed by TimeStep class.
            //  In testing accurate to +- 1ms!
            event.elapsed += delta * event.timeScale;

            if (event.elapsed >= event.delay)
            {
                var remainder = event.elapsed - event.delay;

                //  Limit it, in case it's checked in the callback
                event.elapsed = event.delay;

                //  Process the event
                if (!event.hasDispatched && event.callback)
                {
                    event.hasDispatched = true;
                    event.callback.apply(event.callbackScope, event.args);
                }

                if (event.repeatCount > 0)
                {
                    event.repeatCount--;

                    // Very short delay
                    if (remainder >= event.delay)
                    {
                        while ((remainder >= event.delay) && (event.repeatCount > 0))
                        {
                            if (event.callback)
                            {
                                event.callback.apply(event.callbackScope, event.args);
                            }

                            remainder -= event.delay;
                            event.repeatCount--;
                        }
                    }

                    event.elapsed = remainder;
                    event.hasDispatched = false;
                }
                else if (event.hasDispatched)
                {
                    this._pendingRemoval.push(event);
                }
            }
        }
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
        var i;

        for (i = 0; i < this._pendingInsertion.length; i++)
        {
            this._pendingInsertion[i].destroy();
        }

        for (i = 0; i < this._active.length; i++)
        {
            this._active[i].destroy();
        }

        for (i = 0; i < this._pendingRemoval.length; i++)
        {
            this._pendingRemoval[i].destroy();
        }

        this._active.length = 0;
        this._pendingRemoval.length = 0;
        this._pendingInsertion.length = 0;

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

PluginCache.register('Clock', Clock, 'time');

module.exports = Clock;
