/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Utils.Object.HasAll
 * @since 3.0.0
 *
 * @param {object} source - [description]
 * @param {string[]} keys - [description]
 *
 * @return {boolean} [description]
 */
var HasAll = function (source, keys)
{
    for (var i = 0; i < keys.length; i++)
    {
        if (!source.hasOwnProperty(keys[i]))
        {
            return false;
        }
    }

    return true;
};

module.exports = HasAll;
