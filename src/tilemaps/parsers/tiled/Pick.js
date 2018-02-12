/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var HasValue = require('../../../utils/object/HasValue');

/**
 * [description]
 *
 * @function Phaser.Tilemaps.Parsers.Tiled.Pick
 * @since 3.0.0
 *
 * @param {object} object - [description]
 * @param {array} keys - [description]
 *
 * @return {object} [description]
 */
var Pick = function (object, keys)
{
    var obj = {};

    for (var i = 0; i < keys.length; i++)
    {
        var key = keys[i];

        if (HasValue(object, key))
        {
            obj[key] = object[key];
        }
    }

    return obj;
};

module.exports = Pick;
