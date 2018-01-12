/**
* Internal function to process the separation of a physics body from a tile.
*
* @private
* @method Phaser.Physics.Arcade#processTileSeparationX
* @param {Phaser.Physics.Arcade.Body} body - The Body object to separate.
* @param {number} x - The x separation amount.
*/
var ProcessTileSeparationX = function (body, x)
{
    if (x < 0)
    {
        body.blocked.left = true;
    }
    else if (x > 0)
    {
        body.blocked.right = true;
    }

    body.position.x -= x;

    if (body.bounce.x === 0)
    {
        body.velocity.x = 0;
    }
    else
    {
        body.velocity.x = -body.velocity.x * body.bounce.x;
    }
};

module.exports = ProcessTileSeparationX;
