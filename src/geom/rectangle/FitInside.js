/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetAspectRatio = require('./GetAspectRatio');

//  Fits the target rectangle into the source rectangle.
//  Preserves aspect ratio.
//  Scales and centers the target rectangle to the source rectangle

/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.FitInside
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} target - [description]
 * @param {Phaser.Geom.Rectangle} source - [description]
 *
 * @return {Phaser.Geom.Rectangle} [description]
 */
var FitInside = function (target, source)
{
    var ratio = GetAspectRatio(target);

    if (ratio < GetAspectRatio(source))
    {
        //  Taller than Wide
        target.setSize(source.height * ratio, source.height);
    }
    else
    {
        //  Wider than Tall
        target.setSize(source.width, source.width / ratio);
    }

    return target.setPosition(
        source.centerX - (target.width / 2),
        source.centerY - (target.height / 2)
    );
};

module.exports = FitInside;
