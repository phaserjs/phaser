/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Utils.String.UppercaseFirst
 * @since 3.0.0
 *
 * @param {string} str - [description]
 *
 * @return {string} [description]
 */
var UppercaseFirst = function (str)
{
    return str && str[0].toUpperCase() + str.slice(1);
};

module.exports = UppercaseFirst;
