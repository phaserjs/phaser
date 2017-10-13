// Get sequence of points using getPoint( t )

/**
 * [description]
 *
 * @method Phaser.Curves.Curve#getPoints
 * @since 3.0.0
 *
 * @param {integer} [divisions] - [description]
 *
 * @return {Phaser.Math.Vector2[]} [description]
 */
var GetPoints = function (divisions)
{
    if (divisions === undefined) { divisions = this.defaultDivisions; }

    var points = [];

    for (var d = 0; d <= divisions; d++)
    {
        points.push(this.getPoint(d / divisions));
    }

    return points;
};

module.exports = GetPoints;
