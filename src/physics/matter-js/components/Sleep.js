/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var MatterEvents = require('../lib/core/Events');

/**
 * [description]
 *
 * @name Phaser.Physics.Matter.Components.Sleep
 * @since 3.0.0
 */
var Sleep = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Sleep#setSleepThreshold
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    setSleepThreshold: function (value)
    {
        if (value === undefined) { value = 60; }

        this.body.sleepThreshold = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Sleep#setSleepEvents
     * @since 3.0.0
     *
     * @param {[type]} start - [description]
     * @param {[type]} end - [description]
     *
     * @return {[type]} [description]
     */
    setSleepEvents: function (start, end)
    {
        this.setSleepStartEvent(start);
        this.setSleepEndEvent(end);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Sleep#setSleepStartEvent
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    setSleepStartEvent: function (value)
    {
        if (value)
        {
            var world = this.world;

            MatterEvents.on(this.body, 'sleepStart', function (event)
            {
                world.emit('sleepstart', event, this);
            });
        }
        else
        {
            MatterEvents.off(this.body, 'sleepStart');
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Sleep#setSleepEndEvent
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    setSleepEndEvent: function (value)
    {
        if (value)
        {
            var world = this.world;

            MatterEvents.on(this.body, 'sleepEnd', function (event)
            {
                world.emit('sleepend', event, this);
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
