/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetAspectRatio = require('./GetAspectRatio');

//  Fits the target rectangle around the source rectangle.
//  Preserves aspect ration.
//  Scales and centers the target rectangle to the source rectangle

/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.FitOutside
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [target,$return]
 *
 * @param {Phaser.Geom.Rectangle} target - [description]
 * @param {Phaser.Geom.Rectangle} source - [description]
 *
 * @return {Phaser.Geom.Rectangle} [description]
 */
var FitOutside = function (target, source)
{
    var ratio = GetAspectRatio(target);

    if (ratio > GetAspectRatio(source))
    {
        //  Wider than Tall
        target.setSize(source.height * ratio, source.height);
    }
    else
    {
        //  Taller than Wide
        target.setSize(source.width, source.width / ratio);
    }

    return target.setPosition(
        source.centerX - target.width / 2,
        source.centerY - target.height / 2
    );
};

module.exports = FitOutside;
