var ProcessTileCallbacks = function (tile, sprite)
{
    // Tile callbacks take priority over layer level callbacks
    if (tile.collisionCallback)
    {
        return !tile.collisionCallback.call(tile.collisionCallbackContext, sprite, tile);
    }
    else if (tile.layer.callbacks[tile.index])
    {
        return !tile.layer.callbacks[tile.index].callback.call(
            tile.layer.callbacks[tile.index].callbackContext, sprite, tile
        );
    }

    return true;
};

module.exports = ProcessTileCallbacks;
