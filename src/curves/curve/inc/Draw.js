/**
 * [description]
 *
 * @method Phaser.Curves.Curve#draw
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Graphics} graphics - [description]
 * @param {integer} [pointsTotal=32] - [description]
 *
 * @return {Phaser.GameObjects.Graphics} [description]
 */
var Draw = function (graphics, pointsTotal)
{
    if (pointsTotal === undefined) { pointsTotal = 32; }

    //  So you can chain graphics calls
    return graphics.strokePoints(this.getPoints(pointsTotal));
};

module.exports = Draw;
