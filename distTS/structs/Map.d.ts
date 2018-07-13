/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Class: any;
/**
 * @callback EachMapCallback
 * @generic E - [entry]
 *
 * @param {string} key - [description]
 * @param {*} entry - [description]
 *
 * @return {?boolean} [description]
 */
/**
 * @classdesc
 * The keys of a Map can be arbitrary values.
 * var map = new Map([
 *    [ 1, 'one' ],
 *    [ 2, 'two' ],
 *    [ 3, 'three' ]
 * ]);
 *
 * @class Map
 * @memberOf Phaser.Structs
 * @constructor
 * @since 3.0.0
 *
 * @generic K
 * @generic V
 * @genericUse {V[]} - [elements]
 *
 * @param {Array.<*>} elements - [description]
 */
declare var Map: MapConstructor;
