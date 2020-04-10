/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetTilesWithin = require('./GetTilesWithin');

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
 * @param {integer} [tileX=0] - The left most tile index (in tile coordinates) to use as the origin of the area.
 * @param {integer} [tileY=0] - The top most tile index (in tile coordinates) to use as the origin of the area.
 * @param {integer} [width=max width based on tileX] - How many tiles wide from the `tileX` index the area will be.
 * @param {integer} [height=max height based on tileY] - How many tiles tall from the `tileY` index the area will be.
 * @param {object[]} [weightedIndexes] - An array of objects to randomly draw from during
 * randomization. They should be in the form: { index: 0, weight: 4 } or
 * { index: [0, 1], weight: 4 } if you wish to draw from multiple tile indexes.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 */
var WeightedRandomize = function (tileX, tileY, width, height, weightedIndexes, layer)
{
    if (weightedIndexes === undefined) { return; }

    var i;
    var tiles = GetTilesWithin(tileX, tileY, width, height, null, layer);

    var weightTotal = 0;
    for (i = 0; i < weightedIndexes.length; i++)
    {
        weightTotal += weightedIndexes[i].weight;
    }

    if (weightTotal <= 0) { return; }

    for (i = 0; i < tiles.length; i++)
    {
        var rand = Math.random() * weightTotal;
        var sum = 0;
        var randomIndex = -1;
        for (var j = 0; j < weightedIndexes.length; j++)
        {
            sum += weightedIndexes[j].weight;
            if (rand <= sum)
            {
                var chosen = weightedIndexes[j].index;
                randomIndex = Array.isArray(chosen)
                    ? chosen[Math.floor(Math.random() * chosen.length)]
                    : chosen;
                break;
            }
        }

        tiles[i].index = randomIndex;
    }
};

module.exports = WeightedRandomize;
