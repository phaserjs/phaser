/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Class: any;
/**
 * @callback EdgeZoneSourceCallback
 *
 * @param {integer} quantity - The number of particles to place on the source edge. If 0, `stepRate` should be used instead.
 * @param {number} [stepRate] - The distance between each particle. When set, `quantity` is implied and should be set to `0`.
 *
 * @return {Phaser.Geom.Point[]} - The points placed on the source edge.
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
 * @param {integer} quantity - The number of particles to place on the source edge. Set to 0 to use `stepRate` instead.
 * @param {number} stepRate - The distance between each particle. When set, `quantity` is implied and should be set to 0.
 * @param {boolean} [yoyo=false] - Whether particles are placed from start to end and then end to start.
 * @param {boolean} [seamless=true] - Whether one endpoint will be removed if it's identical to the other.
 */
declare var EdgeZone: any;
