/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculates and returns the bitmask needed to determine if the given
 * categories will collide with each other or not.
 *
 * @function Phaser.Physics.Arcade.GetCollidesWith
 * @since 3.70.0
 *
 * @param {(number|number[])} categories - A unique category bitfield, or an array of them.
 *
 * @return {number} The collision mask.
 */
var GetCollidesWith = function (categories)
{
    var flags = 0;

    if (!Array.isArray(categories))
    {
        flags = categories;
    }
    else
    {
        for (var i = 0; i < categories.length; i++)
        {
            flags |= categories[i];
        }
    }

    return flags;
};

module.exports = GetCollidesWith;
