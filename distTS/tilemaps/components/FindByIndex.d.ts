/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
/**
 * Searches the entire map layer for the first tile matching the given index, then returns that Tile
 * object. If no match is found, it returns null. The search starts from the top-left tile and
 * continues horizontally until it hits the end of the row, then it drops down to the next column.
 * If the reverse boolean is true, it scans starting from the bottom-right corner traveling up to
 * the top-left.
 *
 * @function Phaser.Tilemaps.Components.FindByIndex
 * @private
 * @since 3.0.0
 *
 * @param {integer} index - The tile index value to search for.
 * @param {integer} [skip=0] - The number of times to skip a matching tile before returning.
 * @param {boolean} [reverse=false] - If true it will scan the layer in reverse, starting at the
 * bottom-right. Otherwise it scans from the top-left.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {?Phaser.Tilemaps.Tile} The first (or n skipped) tile with the matching index.
 */
declare var FindByIndex: (findIndex: any, skip: any, reverse: any, layer: any) => any;
