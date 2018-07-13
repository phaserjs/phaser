/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var SetTileCollision: any;
declare var CalculateFacesWithin: (tileX: any, tileY: any, width: any, height: any, layer: any) => void;
/**
 * Sets collision on the tiles within a layer by checking each tile's collision group data
 * (typically defined in Tiled within the tileset collision editor). If any objects are found within
 * a tile's collision group, the tile's colliding information will be set. The `collides` parameter
 * controls if collision will be enabled (true) or disabled (false).
 *
 * @function Phaser.Tilemaps.Components.SetCollisionFromCollisionGroup
 * @private
 * @since 3.0.0
 *
 * @param {boolean} [collides=true] - If true it will enable collision. If false it will clear
 * collision.
 * @param {boolean} [recalculateFaces=true] - Whether or not to recalculate the tile faces after the
 * update.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 */
declare var SetCollisionFromCollisionGroup: (collides: any, recalculateFaces: any, layer: any) => void;
