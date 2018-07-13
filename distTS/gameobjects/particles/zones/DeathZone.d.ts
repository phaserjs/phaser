/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Class: any;
/**
 * @callback DeathZoneSourceCallback
 *
 * @param {number} x - The x coordinate of the particle to check against this source area.
 * @param {number} y - The y coordinate of the particle to check against this source area.
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
declare var DeathZone: any;
