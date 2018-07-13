/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Class: any;
declare var Vector2: any;
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
 * @memberOf Phaser.GameObjects.Particles.Zones
 * @constructor
 * @since 3.0.0
 *
 * @param {RandomZoneSource} source - An object instance with a `getRandomPoint(point)` method.
 */
declare var RandomZone: any;
