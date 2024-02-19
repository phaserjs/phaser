/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Takes a string and removes the character at the given index.
 *
 * @function Phaser.Utils.String.RemoveAt
 * @since 3.50.0
 *
 * @param {string} string - The string to be worked on.
 * @param {number} index - The index of the character to be removed.
 *
 * @return {string} The modified string.
 */
var RemoveAt = function (string, index)
{
    if (index === 0)
    {
        return string.slice(1);
    }
    else
    {
        return string.slice(0, index - 1) + string.slice(index);
    }
};

module.exports = RemoveAt;
