/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../utils/Class');

/**
 * @callback EdgeZoneSourceCallback
 *
 * @param {integer} quantity - [description]
 * @param {integer} [stepRate] - [description]
 *
 * @return {Phaser.Geom.Point[]} - [description]
 */

/**
 * @typedef {object} EdgeZoneSource
 *
 * @property {EdgeZoneSourceCallback} getPoints - A function placing points on the source's edge or edges.
 *
 * @see Phaser.Curves.Curve
 * @see Phaser.Curves.Path
 * @see Phaser.Geom.Circle
 * @see Phaser.Geom.Ellipse
 * @see Phaser.Geom.Line
 * @see Phaser.Geom.Polygon
 * @see Phaser.Geom.Rectangle
 * @see Phaser.Geom.Triangle
 */

/**
 * @classdesc
 * A zone that places particles on a shape's edges.
 *
 * @class EdgeZone
 * @memberOf Phaser.GameObjects.Particles.Zones
 * @constructor
 * @since 3.0.0
 *
 * @param {EdgeZoneSource} source - An object instance with a `getPoints(quantity, stepRate)` method returning an array of points.
 * @param {number} quantity - [description]
 * @param {number} stepRate - [description]
 * @param {boolean} [yoyo=false] - [description]
 * @param {boolean} [seamless=true] - [description]
 */
var EdgeZone = new Class({

    initialize:

    function EdgeZone (source, quantity, stepRate, yoyo, seamless)
    {
        if (yoyo === undefined) { yoyo = false; }
        if (seamless === undefined) { seamless = true; }

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.Zones.EdgeZone#source
         * @type {EdgeZoneSource|RandomZoneSource}
         * @since 3.0.0
         */
        this.source = source;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.Zones.EdgeZone#points
         * @type {Phaser.Geom.Point[]}
         * @default []
         * @since 3.0.0
         */
        this.points = [];

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.Zones.EdgeZone#quantity
         * @type {number}
         * @since 3.0.0
         */
        this.quantity = quantity;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.Zones.EdgeZone#stepRate
         * @type {number}
         * @since 3.0.0
         */
        this.stepRate = stepRate;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.Zones.EdgeZone#yoyo
         * @type {boolean}
         * @since 3.0.0
         */
        this.yoyo = yoyo;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.Zones.EdgeZone#counter
         * @type {number}
         * @default -1
         * @since 3.0.0
         */
        this.counter = -1;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.Zones.EdgeZone#seamless
         * @type {boolean}
         * @since 3.0.0
         */
        this.seamless = seamless;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.Zones.EdgeZone#_length
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._length = 0;

        /**
         * 0 = forwards, 1 = backwards
         *
         * @name Phaser.GameObjects.Particles.Zones.EdgeZone#_direction
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._direction = 0;

        this.updateSource();
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.Zones.EdgeZone#updateSource
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Particles.Zones.EdgeZone} This Edge Zone.
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
     * [description]
     *
     * @method Phaser.GameObjects.Particles.Zones.EdgeZone#changeSource
     * @since 3.0.0
     *
     * @param {object} source - [description]
     *
     * @return {Phaser.GameObjects.Particles.Zones.EdgeZone} This Edge Zone.
     */
    changeSource: function (source)
    {
        this.source = source;

        return this.updateSource();
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.Zones.EdgeZone#getPoint
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Particles.Particle} particle - [description]
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
