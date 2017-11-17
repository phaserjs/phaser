// Find first tile with given index, or null if nothing found.
// Searches from top left to bottom right.
// Skip a number of matches or reverse to search from bottom-right to top-left.
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
