/**
 * [description]
 *
 * @function Phaser.Geom.Ellipse.Area
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Ellipse} ellipse - [description]
 *
 * @return {number} [description]
 */
var Area = function (ellipse)
{
    if (ellipse.isEmpty())
    {
        return 0;
    }

    //  units squared
    return (ellipse.getMajorRadius() * ellipse.getMinorRadius() * Math.PI);
};

module.exports = Area;
