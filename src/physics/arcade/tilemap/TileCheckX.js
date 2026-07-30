/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ProcessTileSeparationX = require('./ProcessTileSeparationX');

/**
 * Checks the given physics body against a tile on the X axis, calculating the overlap and
 * applying separation if a collision is detected. Respects the tile's face and collision flags
 * when the check originates from a TilemapLayer, and dispatches to `ProcessTileSeparationX`
 * (or sets `body.overlapX` if `customSeparateX` is enabled). Used internally by the SeparateTile function.
 *
 * @function Phaser.Physics.Arcade.Tilemap.TileCheckX
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.Body} body - The Body object to separate.
 * @param {Phaser.Tilemaps.Tile} tile - The tile to check.
 * @param {number} tileLeft - The left edge of the tile in world coordinates, in pixels.
 * @param {number} tileRight - The right edge of the tile in world coordinates, in pixels.
 * @param {number} tileBias - The tile bias value. Overlaps greater than this threshold are ignored to prevent tunneling. Typically set to `World.TILE_BIAS`.
 * @param {boolean} isLayer - Is this check coming from a TilemapLayer or an array of tiles?
 *
 * @return {number} The amount of separation that occurred.
 */
var TileCheckX = function (body, tile, tileLeft, tileRight, tileBias, isLayer)
{
    var ox = 0;

    var faceLeft = tile.faceLeft;
    var faceRight = tile.faceRight;
    var collideLeft = tile.collideLeft;
    var collideRight = tile.collideRight;

    if (!isLayer)
    {
        faceLeft = true;
        faceRight = true;
        collideLeft = true;
        collideRight = true;
    }

    if (body.deltaX() < 0 && collideRight && body.checkCollision.left)
    {
        //  Body is moving LEFT
        if (faceRight && body.x < tileRight)
        {
            ox = body.x - tileRight;

            if (ox < -tileBias)
            {
                ox = 0;
            }
        }
    }
    else if (body.deltaX() > 0 && collideLeft && body.checkCollision.right)
    {
        //  Body is moving RIGHT
        if (faceLeft && body.right > tileLeft)
        {
            ox = body.right - tileLeft;

            if (ox > tileBias)
            {
                ox = 0;
            }
        }
    }

    if (ox !== 0)
    {
        if (body.customSeparateX)
        {
            body.overlapX = ox;
        }
        else
        {
            ProcessTileSeparationX(body, ox);
        }
    }

    return ox;
};

module.exports = TileCheckX;
