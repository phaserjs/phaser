var ProcessTileCallbacks = function (tile)
{
    return true;

    // TODO: port v2
    // //  Tilemap & tile callbacks take priority
    // //  A local callback always takes priority over a layer level callback
    // if (tile.collisionCallback && !tile.collisionCallback.call(tile.collisionCallbackContext, body.sprite, tile))
    // {
    //     //  If it returns true then we can carry on, otherwise we should abort.
    //     return false;
    // }
    // else if (typeof tile.layer.callbacks !== 'undefined' && tile.layer.callbacks[tile.index] && !tile.layer.callbacks[tile.index].callback.call(tile.layer.callbacks[tile.index].callbackContext, body.sprite, tile))
    // {
    //     //  If it returns true then we can carry on, otherwise we should abort.
    //     return false;
    // }
};

module.exports = ProcessTileCallbacks;
