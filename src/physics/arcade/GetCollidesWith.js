/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Combines one or more category bitfields using bitwise OR and returns the
 * resulting collision mask. This mask can be assigned to an Arcade Physics body
 * to define which categories of bodies it should collide with.
 *
 * @function Phaser.Physics.Arcade.GetCollidesWith
 * @since 3.70.0
 *
 * @param {(number|number[])} categories - A unique category bitfield, or an array of them.
 *
 * @return {number} A bitmask representing the combined set of categories that should trigger collisions.
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
