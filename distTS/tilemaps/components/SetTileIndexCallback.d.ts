/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
/**
 * Sets a global collision callback for the given tile index within the layer. This will affect all
 * tiles on this layer that have the same index. If a callback is already set for the tile index it
 * will be replaced. Set the callback to null to remove it. If you want to set a callback for a tile
 * at a specific location on the map then see setTileLocationCallback.
 *
 * @function Phaser.Tilemaps.Components.SetTileIndexCallback
 * @private
 * @since 3.0.0
 *
 * @param {(integer|array)} indexes - Either a single tile index, or an array of tile indexes to have a
 * collision callback set for.
 * @param {function} callback - The callback that will be invoked when the tile is collided with.
 * @param {object} callbackContext - The context under which the callback is called.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 */
declare var SetTileIndexCallback: (indexes: any, callback: any, callbackContext: any, layer: any) => void;
