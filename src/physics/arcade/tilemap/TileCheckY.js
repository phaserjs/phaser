/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var ProcessTileSeparationY = require('./ProcessTileSeparationY');

/**
 * Check the body against the given tile on the Y axis.
 *
 * @function Phaser.Physics.Arcade.Tilemap.TileCheckY
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.Body} body - The Body object to separate.
 * @param {Phaser.Tilemaps.Tile} tile - The tile to check.
 * @param {number} tileTop - [description]
 * @param {number} tileBottom - [description]
 * @param {number} tileBias - [description]
 *
 * @return {number} The amount of separation that occurred.
 */
var TileCheckY = function (body, tile, tileTop, tileBottom, tileBias)
{
    var oy = 0;

    if (body.deltaY() < 0 && !body.blocked.up && tile.collideDown && body.checkCollision.up)
    {
        //  Body is moving UP
        if (tile.faceBottom && body.y < tileBottom)
        {
            oy = body.y - tileBottom;

            if (oy < -tileBias)
            {
                oy = 0;
            }
        }
    }
    else if (body.deltaY() > 0 && !body.blocked.down && tile.collideUp && body.checkCollision.down)
    {
        //  Body is moving DOWN
        if (tile.faceTop && body.bottom > tileTop)
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
