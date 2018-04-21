/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../utils/Class');

/**
 * @callback DeathZoneSourceCallback
 *
 * @param {float} x - [description]
 * @param {float} y - [description]
 *
 * @return {boolean} - True if the coordinates are within the source area.
 */

/**
 * @typedef {object} DeathZoneSource
 *
 * @property {DeathZoneSourceCallback} contains
 *
 * @see Phaser.Geom.Circle
 * @see Phaser.Geom.Ellipse
 * @see Phaser.Geom.Polygon
 * @see Phaser.Geom.Rectangle
 * @see Phaser.Geom.Triangle
 */

/**
 * @classdesc
 * A Death Zone.
 *
 * A Death Zone is a special type of zone that will kill a Particle as soon as it either enters, or leaves, the zone.
 *
 * The zone consists of a `source` which could be a Geometric shape, such as a Rectangle or Ellipse, or your own
 * object as long as it includes a `contains` method for which the Particles can be tested against.
 *
 * @class DeathZone
 * @memberOf Phaser.GameObjects.Particles.Zones
 * @constructor
 * @since 3.0.0
 *
 * @param {DeathZoneSource} source - An object instance that has a `contains` method that returns a boolean when given `x` and `y` arguments.
 * @param {boolean} killOnEnter - Should the Particle be killed when it enters the zone? `true` or leaves it? `false`
 */
var DeathZone = new Class({

    initialize:

    function DeathZone (source, killOnEnter)
    {
        /**
         * An object instance that has a `contains` method that returns a boolean when given `x` and `y` arguments.
         * This could be a Geometry shape, such as `Phaser.Geom.Circle`, or your own custom object.
         *
         * @name Phaser.GameObjects.Particles.Zones.DeathZone#source
         * @type {DeathZoneSource}
         * @since 3.0.0
         */
        this.source = source;

        /**
         * Set to `true` if the Particle should be killed if it enters this zone.
         * Set to `false` to kill the Particle if it leaves this zone.
         *
         * @name Phaser.GameObjects.Particles.Zones.DeathZone#killOnEnter
         * @type {boolean}
         * @since 3.0.0
         */
        this.killOnEnter = killOnEnter;
    },

    /**
     * Checks if the given Particle will be killed or not by this zone.
     *
     * @method Phaser.GameObjects.Particles.Zones.DeathZone#willKill
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Particles.Particle} particle - The Particle to be checked against this zone.
     *
     * @return {boolean} Return `true` if the Particle is to be killed, otherwise return `false`.
     */
    willKill: function (particle)
    {
        var withinZone = this.source.contains(particle.x, particle.y);

        return (withinZone && this.killOnEnter || !withinZone && !this.killOnEnter);
    }

});

module.exports = DeathZone;
