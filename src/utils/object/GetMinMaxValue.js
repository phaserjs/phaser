/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetValue = require('./GetValue');
var Clamp = require('../../math/Clamp');

/**
 * [description]
 *
 * @function Phaser.Utils.Object.GetMinMaxValue
 * @since 3.0.0
 *
 * @param {object} source - [description]
 * @param {string} key - [description]
 * @param {number} min - [description]
 * @param {number} max - [description]
 * @param {number} defaultValue - [description]
 *
 * @return {number} [description]
 */
var GetMinMaxValue = function (source, key, min, max, defaultValue)
{
    if (defaultValue === undefined) { defaultValue = min; }

    var value = GetValue(source, key, defaultValue);

    return Clamp(value, min, max);
};

module.exports = GetMinMaxValue;
