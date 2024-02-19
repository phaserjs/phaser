/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');

/**
 * @classdesc
 * A zone that places particles on a shape's edges.
 *
 * @class EdgeZone
 * @memberof Phaser.GameObjects.Particles.Zones
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Types.GameObjects.Particles.EdgeZoneSource} source - An object instance with a `getPoints(quantity, stepRate)` method returning an array of points.
 * @param {number} quantity - The number of particles to place on the source edge. Set to 0 to use `stepRate` instead.
 * @param {number} [stepRate] - The distance between each particle. When set, `quantity` is implied and should be set to 0.
 * @param {boolean} [yoyo=false] - Whether particles are placed from start to end and then end to start.
 * @param {boolean} [seamless=true] - Whether one endpoint will be removed if it's identical to the other.
 * @param {number} [total=-1] - The total number of particles this zone will emit before passing over to the next emission zone in the Emitter. -1 means it will never pass over and you must use `setEmitZone` to change it.
 */
var EdgeZone = new Class({

    initialize:

    function EdgeZone (source, quantity, stepRate, yoyo, seamless, total)
    {
        if (yoyo === undefined) { yoyo = false; }
        if (seamless === undefined) { seamless = true; }
        if (total === undefined) { total = -1; }

        /**
         * An object instance with a `getPoints(quantity, stepRate)` method returning an array of points.
         *
         * @name Phaser.GameObjects.Particles.Zones.EdgeZone#source
         * @type {Phaser.Types.GameObjects.Particles.EdgeZoneSource|Phaser.Types.GameObjects.Particles.RandomZoneSource}
         * @since 3.0.0
         */
        this.source = source;

        /**
         * The points placed on the source edge.
         *
         * @name Phaser.GameObjects.Particles.Zones.EdgeZone#points
         * @type {Phaser.Geom.Point[]}
         * @default []
         * @since 3.0.0
         */
        this.points = [];

        /**
         * The number of particles to place on the source edge. Set to 0 to use `stepRate` instead.
         *
         * @name Phaser.GameObjects.Particles.Zones.EdgeZone#quantity
         * @type {number}
         * @since 3.0.0
         */
        this.quantity = quantity;

        /**
         * The distance between each particle. When set, `quantity` is implied and should be set to 0.
         *
         * @name Phaser.GameObjects.Particles.Zones.EdgeZone#stepRate
         * @type {number}
         * @since 3.0.0
         */
        this.stepRate = stepRate;

        /**
         * Whether particles are placed from start to end and then end to start.
         *
         * @name Phaser.GameObjects.Particles.Zones.EdgeZone#yoyo
         * @type {boolean}
         * @since 3.0.0
         */
        this.yoyo = yoyo;

        /**
         * The counter used for iterating the EdgeZone's points.
         *
         * @name Phaser.GameObjects.Particles.Zones.EdgeZone#counter
         * @type {number}
         * @default -1
         * @since 3.0.0
         */
        this.counter = -1;

        /**
         * Whether one endpoint will be removed if it's identical to the other.
         *
         * @name Phaser.GameObjects.Particles.Zones.EdgeZone#seamless
         * @type {boolean}
         * @since 3.0.0
         */
        this.seamless = seamless;

        /**
         * An internal count of the points belonging to this EdgeZone.
         *
         * @name Phaser.GameObjects.Particles.Zones.EdgeZone#_length
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._length = 0;

        /**
         * An internal value used to keep track of the current iteration direction for the EdgeZone's points.
         *
         * 0 = forwards, 1 = backwards
         *
         * @name Phaser.GameObjects.Particles.Zones.EdgeZone#_direction
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._direction = 0;

        /**
         * The total number of particles this zone will emit before the Emitter
         * transfers control over to the next zone in its emission zone list.
         *
         * By default this is -1, meaning it will never pass over from this
         * zone to another one. You can call the `ParticleEmitter.setEmitZone`
         * method to change it, or set this value to something else via the
         * config, or directly at runtime.
         *
         * A value of 1 would mean the zones rotate in order, but it can
         * be set to any integer value.
         *
         * @name Phaser.GameObjects.Particles.Zones.EdgeZone#total
         * @type {number}
         * @since 3.60.0
         */
        this.total = total;

        this.updateSource();
    },

    /**
     * Update the {@link Phaser.GameObjects.Particles.Zones.EdgeZone#points} from the EdgeZone's
     * {@link Phaser.GameObjects.Particles.Zones.EdgeZone#source}.
     *
     * Also updates internal properties.
     *
     * @method Phaser.GameObjects.Particles.Zones.EdgeZone#updateSource
     * @since 3.0.0
     *
     * @return {this} This Edge Zone.
     */
    updateSource: function ()
    {
        this.points = this.source.getPoints(this.quantity, this.stepRate);

        //  Remove ends?
        if (this.seamless)
        {
            var a = this.points[0];
            var b = this.points[this.points.length - 1];

            if (a.x === b.x && a.y === b.y)
            {
                this.points.pop();
            }
        }

        var oldLength = this._length;

        this._length = this.points.length;

        //  Adjust counter if we now have less points than before
        if (this._length < oldLength && this.counter > this._length)
        {
            this.counter = this._length - 1;
        }

        return this;
    },

    /**
     * Change the source of the EdgeZone.
     *
     * @method Phaser.GameObjects.Particles.Zones.EdgeZone#changeSource
     * @since 3.0.0
     *
     * @param {Phaser.Types.GameObjects.Particles.EdgeZoneSource} source - An object instance with a `getPoints(quantity, stepRate)` method returning an array of points.
     *
     * @return {this} This Edge Zone.
     */
    changeSource: function (source)
    {
        this.source = source;

        return this.updateSource();
    },

    /**
     * Get the next point in the Zone and set its coordinates on the given Particle.
     *
     * @method Phaser.GameObjects.Particles.Zones.EdgeZone#getPoint
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Particles.Particle} particle - The Particle.
     */
    getPoint: function (particle)
    {
        if (this._direction === 0)
        {
            this.counter++;

            if (this.counter >= this._length)
            {
                if (this.yoyo)
                {
                    this._direction = 1;
                    this.counter = this._length - 1;
                }
                else
                {
                    this.counter = 0;
                }
            }
        }
        else
        {
            this.counter--;

            if (this.counter === -1)
            {
                if (this.yoyo)
                {
                    this._direction = 0;
                    this.counter = 0;
                }
                else
                {
                    this.counter = this._length - 1;
                }
            }
        }

        var point = this.points[this.counter];

        if (point)
        {
            particle.x = point.x;
            particle.y = point.y;
        }
    }

});

module.exports = EdgeZone;
