/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var MATH = require('../../math/const');
var GetValue = require('./GetValue');

//  Allowed types:

//  Implicit
//  {
//      x: 4
//  }
//
//  From function
//  {
//      x: function ()
//  }
//
//  Randomly pick one element from the array
//  {
//      x: [a, b, c, d, e, f]
//  }
//
//  Random integer between min and max:
//  {
//      x: { randInt: [min, max] }
//  }
//
//  Random float between min and max:
//  {
//      x: { randFloat: [min, max] }
//  }

/**
 * [description]
 *
 * @function Phaser.Utils.Objects.GetAdvancedValue
 * @since 3.0.0
 *
 * @param {object} source - [description]
 * @param {string} key - [description]
 * @param {*} defaultValue - [description]
 *
 * @return {*} [description]
 */
var GetAdvancedValue = function (source, key, defaultValue)
{
    var value = GetValue(source, key, null);

    if (value === null)
    {
        return defaultValue;
    }
    else if (Array.isArray(value))
    {
        return MATH.RND.pick(value);
    }
    else if (typeof value === 'object')
    {
        if (value.hasOwnProperty('randInt'))
        {
            return MATH.RND.integerInRange(value.randInt[0], value.randInt[1]);
        }
        else if (value.hasOwnProperty('randFloat'))
        {
            return MATH.RND.realInRange(value.randFloat[0], value.randFloat[1]);
        }
    }
    else if (typeof value === 'function')
    {
        return value(key);
    }

    return value;
};

module.exports = GetAdvancedValue;
