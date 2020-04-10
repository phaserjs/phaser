/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Events = require('../events');
var Sleeping = require('../lib/core/Sleeping');
var MatterEvents = require('../lib/core/Events');

/**
 * Enables a Matter-enabled Game Object to be able to go to sleep. Should be used as a mixin and not directly.
 *
 * @namespace Phaser.Physics.Matter.Components.Sleep
 * @since 3.0.0
 */
var Sleep = {

    /**
     * Sets this Body to sleep.
     *
     * @method Phaser.Physics.Matter.Components.Sleep#setToSleep
     * @since 3.22.0
     *
     * @return {this} This Game Object.
     */
    setToSleep: function ()
    {
        Sleeping.set(this.body, true);
    },

    /**
     * Wakes this Body if asleep.
     *
     * @method Phaser.Physics.Matter.Components.Sleep#setAwake
     * @since 3.22.0
     *
     * @return {this} This Game Object.
     */
    setAwake: function ()
    {
        Sleeping.set(this.body, false);
    },

    /**
     * Sets the number of updates in which this body must have near-zero velocity before it is set as sleeping (if sleeping is enabled by the engine).
     *
     * @method Phaser.Physics.Matter.Components.Sleep#setSleepThreshold
     * @since 3.0.0
     *
     * @param {number} [value=60] - A `Number` that defines the number of updates in which this body must have near-zero velocity before it is set as sleeping.
     *
     * @return {this} This Game Object.
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
     * @return {this} This Game Object.
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
     * @param {boolean} value - `true` to enable the sleep event, or `false` to disable it.
     *
     * @return {this} This Game Object.
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
     * @param {boolean} value - `true` to enable the sleep event, or `false` to disable it.
     *
     * @return {this} This Game Object.
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
