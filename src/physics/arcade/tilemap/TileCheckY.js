/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ProcessTileSeparationY = require('./ProcessTileSeparationY');

/**
 * Check the body against the given tile on the Y axis.
 * Used internally by the SeparateTile function.
 *
 * @function Phaser.Physics.Arcade.Tilemap.TileCheckY
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.Body} body - The Body object to separate.
 * @param {Phaser.Tilemaps.Tile} tile - The tile to check.
 * @param {number} tileTop - The top position of the tile within the tile world.
 * @param {number} tileBottom - The bottom position of the tile within the tile world.
 * @param {number} tileBias - The tile bias value. Populated by the `World.TILE_BIAS` constant.
 * @param {boolean} isLayer - Is this check coming from a TilemapLayer or an array of tiles?
 *
 * @return {number} The amount of separation that occurred.
 */
var TileCheckY = function (body, tile, tileTop, tileBottom, tileBias, isLayer)
{
    var oy = 0;

    var faceTop = tile.faceTop;
    var faceBottom = tile.faceBottom;
    var collideUp = tile.collideUp;
    var collideDown = tile.collideDown;

    if (!isLayer)
    {
        faceTop = true;
        faceBottom = true;
        collideUp = true;
        collideDown = true;
    }

    if (body.deltaY() < 0 && collideDown && body.checkCollision.up)
    {
        //  Body is moving UP
        if (faceBottom && body.y < tileBottom)
        {
            oy = body.y - tileBottom;

            if (oy < -tileBias)
            {
                oy = 0;
            }
        }
    }
    else if (body.deltaY() > 0 && collideUp && body.checkCollision.down)
    {
        //  Body is moving DOWN
        if (faceTop && body.bottom > tileTop)
        {
            oy = body.bottom - tileTop;

            if (oy > tileBias)
            {
                oy = 0;
            }
        }
    }

    if (oy !== 0)
    {
        if (body.customSeparateY)
        {
            body.overlapY = oy;
        }
        else
        {
            ProcessTileSeparationY(body, oy);
        }
    }

    return oy;
};

module.exports = TileCheckY;
