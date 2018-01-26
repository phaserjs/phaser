var GetValue = require('./GetValue');
var Clamp = require('../../math/Clamp');

/**
 * [description]
 *
 * @function Phaser.Utils.Object.GetMinMaxValue
 * @since 3.0.0
 *
 * @param {[type]} source - [description]
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
