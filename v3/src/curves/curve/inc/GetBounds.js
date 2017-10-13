var FromPoints = require('../../../geom/rectangle/FromPoints');
var Rectangle = require('../../../geom/rectangle/Rectangle');

var GetBounds = function (out, accuracy)
{
    if (out === undefined) { out = new Rectangle(); }
    if (accuracy === undefined) { accuracy = 16; }

    var len = this.getLength();

    if (accuracy > len)
    {
        accuracy = len / 2;
    }

    //  The length of the curve in pixels
    //  So we'll have 1 spaced point per 'accuracy' pixels

    var spaced = Math.max(1, Math.round(len / accuracy));

    return FromPoints(this.getSpacedPoints(spaced), out);
};

module.exports = GetBounds;
