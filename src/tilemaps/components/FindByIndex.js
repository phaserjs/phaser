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
var FindByIndex = function (findIndex, skip, reverse, layer)
{
    if (skip === undefined) { skip = 0; }
    if (reverse === undefined) { reverse = false; }

    var count = 0;
    var tx;
    var ty;
    var tile;

    if (reverse)
    {
        for (ty = layer.height - 1; ty >= 0; ty--)
        {
            for (tx = layer.width - 1; tx >= 0; tx--)
            {
                tile = layer.data[ty][tx];
                if (tile && tile.index === findIndex)
                {
                    if (count === skip)
                    {
                        return tile;
                    }
                    else
                    {
                        count += 1;
                    }
                }
            }
        }
    }
    else
    {
        for (ty = 0; ty < layer.height; ty++)
        {
            for (tx = 0; tx < layer.width; tx++)
            {
                tile = layer.data[ty][tx];
                if (tile && tile.index === findIndex)
                {
                    if (count === skip)
                    {
                        return tile;
                    }
                    else
                    {
                        count += 1;
                    }
                }
            }
        }
    }

    return null;
};

module.exports = FindByIndex;
