var ProcessTileSeparationX = require('./ProcessTileSeparationX');

/**
* Check the body against the given tile on the X axis.
*
* @private
* @method Phaser.Physics.Arcade#tileCheckX
* @param {Phaser.Physics.Arcade.Body} body - The Body object to separate.
* @param {Phaser.Tile} tile - The tile to check.
* @param {Phaser.TilemapLayer} tilemapLayer - The tilemapLayer to collide against.
* @return {number} The amount of separation that occurred.
*/
var TileCheckX = function (body, tile, tileLeft, tileRight, tileBias)
{
    var ox = 0;

    if (body.deltaX() < 0 && !body.blocked.left && tile.collideRight && body.checkCollision.left)
    {
        //  Body is moving LEFT
        if (tile.faceRight && body.x < tileRight)
        {
            ox = body.x - tileRight;

            if (ox < -tileBias)
            {
                ox = 0;
            }
        }
    }
    else if (body.deltaX() > 0 && !body.blocked.right && tile.collideLeft && body.checkCollision.right)
    {
        //  Body is moving RIGHT
        if (tile.faceLeft && body.right > tileLeft)
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
