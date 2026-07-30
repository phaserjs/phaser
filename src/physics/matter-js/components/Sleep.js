/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Events = require('../events');
var Sleeping = require('../lib/core/Sleeping');
var MatterEvents = require('../lib/core/Events');

/**
 * Provides methods for controlling the sleep state of a Matter.js physics body. Sleep is a performance
 * optimization in Matter.js: when a body has had near-zero velocity for a set number of updates, the
 * engine can put it to sleep, temporarily removing it from active simulation. Sleeping bodies do not
 * participate in collision detection or physics updates, which can significantly reduce CPU overhead
 * in scenes with many idle bodies. When a sleeping body is disturbed by a collision or a manual wake
 * call, it is reactivated automatically. This component should be used as a mixin and not directly.
 *
 * @namespace Phaser.Physics.Matter.Components.Sleep
 * @since 3.0.0
 */
var Sleep = {

    /**
     * Immediately puts this physics body to sleep, removing it from active simulation.
     * A sleeping body will not move, generate collisions, or consume CPU until it is woken.
     * It can be woken manually via `setAwake`, or automatically when struck by another body.
     *
     * @method Phaser.Physics.Matter.Components.Sleep#setToSleep
     * @since 3.22.0
     *
     * @return {this} This Game Object instance.
     */
    setToSleep: function ()
    {
        Sleeping.set(this.body, true);

        return this;
    },

    /**
     * Wakes this physics body if it is currently asleep, returning it to active simulation.
     * Once awake, the body will resume participating in collisions and physics updates.
     *
     * @method Phaser.Physics.Matter.Components.Sleep#setAwake
     * @since 3.22.0
     *
     * @return {this} This Game Object instance.
     */
    setAwake: function ()
    {
        Sleeping.set(this.body, false);

        return this;
    },

    /**
     * Sets the number of updates in which this body must have near-zero velocity before it is set as sleeping (if sleeping is enabled by the engine).
     *
     * @method Phaser.Physics.Matter.Components.Sleep#setSleepThreshold
     * @since 3.0.0
     *
     * @param {number} [value=60] - The number of consecutive updates with near-zero velocity required before the body is put to sleep.
     *
     * @return {this} This Game Object instance.
     */
    setSleepThreshold: function (value)
    {
        if (value === undefined) { value = 60; }

        this.body.sleepThreshold = value;

        return this;
    },

    /**
     * Enable sleep and wake events for this body.
     *
     * By default when a body goes to sleep, or wakes up, it will not emit any events.
     *
     * The events are emitted by the Matter World instance and can be listened to via
     * the `SLEEP_START` and `SLEEP_END` events.
     *
     * @method Phaser.Physics.Matter.Components.Sleep#setSleepEvents
     * @since 3.0.0
     *
     * @param {boolean} start - `true` if you want the sleep start event to be emitted for this body.
     * @param {boolean} end - `true` if you want the sleep end event to be emitted for this body.
     *
     * @return {this} This Game Object instance.
     */
    setSleepEvents: function (start, end)
    {
        this.setSleepStartEvent(start);
        this.setSleepEndEvent(end);

        return this;
    },

    /**
     * Enables or disables the Sleep Start event for this body.
     *
     * @method Phaser.Physics.Matter.Components.Sleep#setSleepStartEvent
     * @since 3.0.0
     *
     * @param {boolean} value - `true` to enable the `SLEEP_START` event for this body, or `false` to disable it.
     *
     * @return {this} This Game Object instance.
     */
    setSleepStartEvent: function (value)
    {
        if (value)
        {
            var world = this.world;

            MatterEvents.on(this.body, 'sleepStart', function (event)
            {
                world.emit(Events.SLEEP_START, event, this);
            });
        }
        else
        {
            MatterEvents.off(this.body, 'sleepStart');
        }

        return this;
    },

    /**
     * Enables or disables the Sleep End event for this body.
     *
     * @method Phaser.Physics.Matter.Components.Sleep#setSleepEndEvent
     * @since 3.0.0
     *
     * @param {boolean} value - `true` to enable the `SLEEP_END` event for this body, or `false` to disable it.
     *
     * @return {this} This Game Object instance.
     */
    setSleepEndEvent: function (value)
    {
        if (value)
        {
            var world = this.world;

            MatterEvents.on(this.body, 'sleepEnd', function (event)
            {
                world.emit(Events.SLEEP_END, event, this);
            });
        }
        else
        {
            MatterEvents.off(this.body, 'sleepEnd');
        }

        return this;
    }

};

module.exports = Sleep;
