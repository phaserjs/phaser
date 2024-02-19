/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetAspectRatio = require('./GetAspectRatio');

/**
 * Adjusts the target rectangle, changing its width, height and position,
 * so that it fits inside the area of the source rectangle, while maintaining its original
 * aspect ratio.
 *
 * Unlike the `FitOutside` function, there may be some space inside the source area not covered.
 *
 * @function Phaser.Geom.Rectangle.FitInside
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [target,$return]
 *
 * @param {Phaser.Geom.Rectangle} target - The target rectangle to adjust.
 * @param {Phaser.Geom.Rectangle} source - The source rectangle to envelop the target in.
 *
 * @return {Phaser.Geom.Rectangle} The modified target rectangle instance.
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
