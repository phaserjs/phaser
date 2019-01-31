/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Takes the given string and reverses it, returning the reversed string.
 * For example if given the string `Atari 520ST` it would return `TS025 iratA`.
 *
 * @function Phaser.Utils.String.Reverse
 * @since 3.0.0
 *
 * @param {string} string - The string to be reversed.
 *
 * @return {string} The reversed string.
 */
var Reverse = function (string)
{
    return string.split('').reverse().join('');
};

module.exports = Reverse;
