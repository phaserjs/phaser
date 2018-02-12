/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Compares the `x`, `y`, `width` and `height` properties of the two given Ellipses.
 * Returns `true` if they all match, otherwise returns `false`.
 *
 * @function Phaser.Geom.Ellipse.Equals
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Ellipse} ellipse - The first Ellipse to compare.
 * @param {Phaser.Geom.Ellipse} toCompare - The second Ellipse to compare.
 *
 * @return {boolean} `true` if the two Ellipse equal each other, otherwise `false`.
 */
var Equals = function (ellipse, toCompare)
{
    return (
        ellipse.x === toCompare.x &&
        ellipse.y === toCompare.y &&
        ellipse.width === toCompare.width &&
        ellipse.height === toCompare.height
    );
};

module.exports = Equals;
