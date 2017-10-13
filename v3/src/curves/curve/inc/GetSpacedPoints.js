// Get sequence of points using getPointAt( u )

/**
 * [description]
 *
 * @method Phaser.Curves.Curve#getSpacedPoints
 * @since 3.0.0
 *
 * @param {integer} [divisions] - [description]
 *
 * @return {Phaser.Math.Vector2[]} [description]
 */
var GetSpacedPoints = function (divisions)
{
    if (divisions === undefined) { divisions = this.defaultDivisions; }

    var points = [];

    for (var d = 0; d <= divisions; d++)
    {
        var t = this.getUtoTmapping(d / divisions, null, divisions);

        points.push(this.getPoint(t));
    }

    return points;
};

module.exports = GetSpacedPoints;
