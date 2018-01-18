var ProcessTileSeparationY = require('./ProcessTileSeparationY');

/**
* Check the body against the given tile on the Y axis.
*
* @private
* @method Phaser.Physics.Arcade#tileCheckY
* @param {Phaser.Physics.Arcade.Body} body - The Body object to separate.
* @param {Phaser.Tile} tile - The tile to check.
* @param {Phaser.TilemapLayer} tilemapLayer - The tilemapLayer to collide against.
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
