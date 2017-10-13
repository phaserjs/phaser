var Point = require('../point/Point');

//  Get a point on the given line 'progress' percentage along its length.
//  progress is a value between 0 and 1.

/**
 * [description]
 *
 * @function Phaser.Geom.Line.GetPoint
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - [description]
 * @param {float} progress - [description]
 * @param {Phaser.Geom.Point|object} [out] - [description]
 *
 * @return {Phaser.Geom.Point|object} [description]
 */
var GetPoint = function (line, progress, out)
{
    if (out === undefined) { out = new Point(); }

    out.x = line.x1 + (line.x2 - line.x1) * progress;
    out.y = line.y1 + (line.y2 - line.y1) * progress;

    return out;
};

module.exports = GetPoint;
