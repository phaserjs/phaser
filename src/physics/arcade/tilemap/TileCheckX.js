/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ProcessTileSeparationX = require('./ProcessTileSeparationX');

/**
 * Check the body against the given tile on the X axis.
 * Used internally by the SeparateTile function.
 *
 * @function Phaser.Physics.Arcade.Tilemap.TileCheckX
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.Body} body - The Body object to separate.
 * @param {Phaser.Tilemaps.Tile} tile - The tile to check.
 * @param {number} tileLeft - The left position of the tile within the tile world.
 * @param {number} tileRight - The right position of the tile within the tile world.
 * @param {number} tileBias - The tile bias value. Populated by the `World.TILE_BIAS` constant.
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

    if (body.deltaX() < 0 && !body.blocked.left && collideRight && body.checkCollision.left)
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
    else if (body.deltaX() > 0 && !body.blocked.right && collideLeft && body.checkCollision.right)
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
