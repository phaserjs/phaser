/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * A function to process the collision callbacks between a single tile and an Arcade Physics enabled Game Object.
 *
 * @function Phaser.Physics.Arcade.Tilemap.ProcessTileCallbacks
 * @since 3.0.0
 *
 * @param {Phaser.Tilemaps.Tile} tile - The Tile to process.
 * @param {Phaser.GameObjects.Sprite} sprite - The Game Object to process with the Tile.
 *
 * @return {boolean} The result of the callback, `true` for further processing, or `false` to skip this pair.
 */
var ProcessTileCallbacks = function (tile, sprite)
{
    //  Tile callbacks take priority over layer level callbacks
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
