/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var SetTileCollision: any;
declare var CalculateFacesWithin: (tileX: any, tileY: any, width: any, height: any, layer: any) => void;
declare var SetLayerCollisionIndex: any;
/**
 * Sets collision on the given tile or tiles within a layer by index. You can pass in either a
 * single numeric index or an array of indexes: [2, 3, 15, 20]. The `collides` parameter controls if
 * collision will be enabled (true) or disabled (false).
 *
 * @function Phaser.Tilemaps.Components.SetCollision
 * @private
 * @since 3.0.0
 *
 * @param {(integer|array)} indexes - Either a single tile index, or an array of tile indexes.
 * @param {boolean} [collides=true] - If true it will enable collision. If false it will clear
 * collision.
 * @param {boolean} [recalculateFaces=true] - Whether or not to recalculate the tile faces after the
 * update.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 */
declare var SetCollision: (indexes: any, collides: any, recalculateFaces: any, layer: any) => void;
