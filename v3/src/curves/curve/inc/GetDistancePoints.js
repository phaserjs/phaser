//  Return an array of points, spaced out X distance pixels apart

/**
 * [description]
 *
 * @method Phaser.Curves.Curve#getDistancePoints
 * @since 3.0.0
 *
 * @param {integer} distance - [description]
 *
 * @return {Phaser.Geom.Point[]} [description]
 */
var GetDistancePoints = function (distance)
{
    var len = this.getLength();

    var spaced = Math.max(1, len / distance);

    return this.getSpacedPoints(spaced);
};

module.exports = GetDistancePoints;
