var FromPoints = require('../../../geom/rectangle/FromPoints');
var Rectangle = require('../../../geom/rectangle/Rectangle');

/**
 * [description]
 *
 * @method Phaser.Curves.Curve#getBounds
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} out - [description]
 * @param {integer} [accuracy=16] - [description]
 *
 * @return {Phaser.Geom.Rectangle} [description]
 */
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
