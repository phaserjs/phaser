/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var GetTilesWithin: any;
/**
 * Randomizes the indexes of a rectangular region of tiles (in tile coordinates) within the
 * specified layer. Each tile will receive a new index. New indexes are drawn from the given
 * weightedIndexes array. An example weighted array:
 *
 * [
 *  { index: 6, weight: 4 },    // Probability of index 6 is 4 / 8
 *  { index: 7, weight: 2 },    // Probability of index 7 would be 2 / 8
 *  { index: 8, weight: 1.5 },  // Probability of index 8 would be 1.5 / 8
 *  { index: 26, weight: 0.5 }  // Probability of index 27 would be 0.5 / 8
 * ]
 *
 * The probability of any index being choose is (the index's weight) / (sum of all weights). This
 * method only modifies tile indexes and does not change collision information.
 *
 * @function Phaser.Tilemaps.Components.WeightedRandomize
 * @private
 * @since 3.0.0
 *
 * @param {integer} [tileX=0] - [description]
 * @param {integer} [tileY=0] - [description]
 * @param {integer} [width=max width based on tileX] - [description]
 * @param {integer} [height=max height based on tileY] - [description]
 * @param {object[]} [weightedIndexes] - An array of objects to randomly draw from during
 * randomization. They should be in the form: { index: 0, weight: 4 } or
 * { index: [0, 1], weight: 4 } if you wish to draw from multiple tile indexes.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 */
declare var WeightedRandomize: (tileX: any, tileY: any, width: any, height: any, weightedIndexes: any, layer: any) => void;
