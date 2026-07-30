/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Checks whether a per-tile or per-tile-index collision callback has been registered for the given tile and, if so,
 * invokes it with the colliding Game Object. Tile-level callbacks (set directly on the tile) take priority over
 * layer-level callbacks (set on the tile layer by tile index). If the callback returns `true` the collision is
 * vetoed and this function returns `false` to skip further processing of this pair. If no callback is registered,
 * this function returns `true` so that normal Arcade Physics collision resolution continues.
 *
 * @function Phaser.Physics.Arcade.Tilemap.ProcessTileCallbacks
 * @since 3.0.0
 *
 * @param {Phaser.Tilemaps.Tile} tile - The Tile to process.
 * @param {Phaser.GameObjects.Sprite} sprite - The Game Object to process with the Tile.
 *
 * @return {boolean} `true` if collision processing should continue for this tile/sprite pair, or `false` if a callback vetoed the collision and it should be skipped.
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
