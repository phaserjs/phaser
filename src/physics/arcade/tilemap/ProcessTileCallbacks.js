/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Physics.Arcade.Tilemap.ProcessTileCallbacks
 * @since 3.0.0
 *
 * @param {[type]} tile - [description]
 * @param {Phaser.GameObjects.Sprite} sprite - [description]
 *
 * @return {boolean} [description]
 */
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
