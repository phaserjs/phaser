/**
 * [description]
 *
 * @method Phaser.Curves.Path#draw
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Graphics} graphics - [description]
 * @param {integer} [pointsTotal=32] - [description]
 *
 * @return {Phaser.GameObjects.Graphics} [description]
 */
var Draw = function (graphics, pointsTotal)
{
    for (var i = 0; i < this.curves.length; i++)
    {
        var curve = this.curves[i];

        if (!curve.active)
        {
            continue;
        }

        curve.draw(graphics, pointsTotal);
    }

    return graphics;
};

module.exports = Draw;
