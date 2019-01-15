/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../utils/Class');
var Vector2 = require('../../../math/Vector2');

/**
 * @callback RandomZoneSourceCallback
 *
 * @param {Phaser.Math.Vector2} point - A point to modify.
 */

/**
 * @typedef {object} RandomZoneSource
 *
 * @property {RandomZoneSourceCallback} getRandomPoint - A function modifying its point argument.
 *
 * @see Phaser.Geom.Circle
 * @see Phaser.Geom.Ellipse
 * @see Phaser.Geom.Line
 * @see Phaser.Geom.Polygon
 * @see Phaser.Geom.Rectangle
 * @see Phaser.Geom.Triangle
 */

/**
 * @classdesc
 * A zone that places particles randomly within a shape's area.
 *
 * @class RandomZone
 * @memberof Phaser.GameObjects.Particles.Zones
 * @constructor
 * @since 3.0.0
 *
 * @param {RandomZoneSource} source - An object instance with a `getRandomPoint(point)` method.
 */
var RandomZone = new Class({

    initialize:

    function RandomZone (source)
    {
        /**
         * An object instance with a `getRandomPoint(point)` method.
         *
         * @name Phaser.GameObjects.Particles.Zones.RandomZone#source
         * @type {RandomZoneSource}
         * @since 3.0.0
         */
        this.source = source;

        /**
         * Internal calculation vector.
         *
         * @name Phaser.GameObjects.Particles.Zones.RandomZone#_tempVec
         * @type {Phaser.Math.Vector2}
         * @private
         * @since 3.0.0
         */
        this._tempVec = new Vector2();
    },

    /**
     * Get the next point in the Zone and set its coordinates on the given Particle.
     *
     * @method Phaser.GameObjects.Particles.Zones.RandomZone#getPoint
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Particles.Particle} particle - The Particle.
     */
    getPoint: function (particle)
    {
        var vec = this._tempVec;

        this.source.getRandomPoint(vec);

        particle.x = vec.x;
        particle.y = vec.y;
    }

});

module.exports = RandomZone;
