var LineCurve = require('../../line/LineCurve');

/**
 * [description]
 *
 * @method Phaser.Curves.Path#closePath
 * @since 3.0.0
 *
 * @return {Phaser.Curves.Path} [description]
 */
var ClosePath = function ()
{
    // Add a line curve if start and end of lines are not connected
    var startPoint = this.curves[0].getPoint(0);
    var endPoint = this.curves[this.curves.length - 1].getPoint(1);

    if (!startPoint.equals(endPoint))
    {
        //  This will copy a reference to the vectors, which probably isn't sensible
        this.curves.push(new LineCurve(endPoint, startPoint));
    }

    return this;
};

module.exports = ClosePath;
