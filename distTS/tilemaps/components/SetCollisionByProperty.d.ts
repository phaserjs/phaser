/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var SetTileCollision: any;
declare var CalculateFacesWithin: (tileX: any, tileY: any, width: any, height: any, layer: any) => void;
declare var HasValue: any;
/**
 * Sets collision on the tiles within a layer by checking tile properties. If a tile has a property
 * that matches the given properties object, its collision flag will be set. The `collides`
 * parameter controls if collision will be enabled (true) or disabled (false). Passing in
 * `{ collides: true }` would update the collision flag on any tiles with a "collides" property that
 * has a value of true. Any tile that doesn't have "collides" set to true will be ignored. You can
 * also use an array of values, e.g. `{ types: ["stone", "lava", "sand" ] }`. If a tile has a
 * "types" property that matches any of those values, its collision flag will be updated.
 *
 * @function Phaser.Tilemaps.Components.SetCollisionByProperty
 * @private
 * @since 3.0.0
 *
 * @param {object} properties - An object with tile properties and corresponding values that should
 * be checked.
 * @param {boolean} [collides=true] - If true it will enable collision. If false it will clear
 * collision.
 * @param {boolean} [recalculateFaces=true] - Whether or not to recalculate the tile faces after the
 * update.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 */
declare var SetCollisionByProperty: (properties: any, collides: any, recalculateFaces: any, layer: any) => void;
