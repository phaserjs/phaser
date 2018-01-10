/**
 * [description]
 *
 * @method Phaser.Curves.Path#getSpacedPoints
 * @since 3.0.0
 *
 * @param {integer} [divisions=40] - [description]
 *
 * @return {Phaser.Math.Vector2[]} [description]
 */
var GetSpacedPoints = function (divisions)
{
    if (divisions === undefined) { divisions = 40; }

    var points = [];

    for (var i = 0; i <= divisions; i++)
    {
        points.push(this.getPoint(i / divisions));
    }

    if (this.autoClose)
    {
        points.push(points[0]);
    }

    return points;
};

module.exports = GetSpacedPoints;
