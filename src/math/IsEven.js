/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Check if a given value is an even number.
 *
 * @function Phaser.Math.IsEven
 * @since 3.0.0
 *
 * @param {number} value - The number to perform the check with.
 *
 * @return {boolean} Whether the number is even or not.
 */
var IsEven = function (value)
{
    // Use abstract equality == for "is number" test

    // eslint-disable-next-line eqeqeq
    return (value == parseFloat(value)) ? !(value % 2) : void 0;
};

module.exports = IsEven;
