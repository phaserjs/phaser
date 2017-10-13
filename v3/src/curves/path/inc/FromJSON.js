var CubicBezierCurve = require('../../cubicbezier/CubicBezierCurve');
var EllipseCurve = require('../../ellipse/EllipseCurve');
var LineCurve = require('../../line/LineCurve');
var SplineCurve = require('../../spline/SplineCurve');

var FromJSON = function (data)
{
    //  data should be an object matching the Path.toJSON object structure.

    this.curves = [];
    this.cacheLengths = [];

    this.startPoint.set(data.x, data.y);

    this.autoClose = data.autoClose;

    for (var i = 0; i < data.curves.length; i++)
    {
        var curve = data.curves[i];

        switch (curve.type)
        {
            case 'LineCurve':
                this.add(LineCurve.fromJSON(curve));
                break;

            case 'EllipseCurve':
                this.add(EllipseCurve.fromJSON(curve));
                break;

            case 'SplineCurve':
                this.add(SplineCurve.fromJSON(curve));
                break;

            case 'CubicBezierCurve':
                this.add(CubicBezierCurve.fromJSON(curve));
                break;
        }
    }

    return this;
};

module.exports = FromJSON;
