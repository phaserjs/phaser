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
     * @param {number} [value=60] - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
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
     * @param {boolean} start - [description]
     * @param {boolean} end - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
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
     * @param {boolean} value - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
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
     * @param {boolean} value - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
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
