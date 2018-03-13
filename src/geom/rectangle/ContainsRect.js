/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  Checks if rectB is fully contained within rectA

/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.ContainsRect
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rectA - [description]
 * @param {Phaser.Geom.Rectangle} rectB - [description]
 *
 * @return {boolean} [description]
 */
var ContainsRect = function (rectA, rectB)
{
    //  Volume check (if rectB volume > rectA then rectA cannot contain it)
    if ((rectB.width * rectB.height) > (rectA.width * rectA.height))
    {
        return false;
    }

    return (
        (rectB.x > rectA.x && rectB.x < rectA.right) &&
        (rectB.right > rectA.x && rectB.right < rectA.right) &&
        (rectB.y > rectA.y && rectB.y < rectA.bottom) &&
        (rectB.bottom > rectA.y && rectB.bottom < rectA.bottom)
    );
};

module.exports = ContainsRect;
