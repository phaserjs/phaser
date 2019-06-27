/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var EaseMap = require('../../math/easing/EaseMap');

/**
 * [description]
 *
 * @function Phaser.Tweens.Builders.GetEaseFunction
 * @since 3.0.0
 *
 * @param {(string|function)} ease - [description]
 * @param {array} easeParams - [description]
 *
 * @return {function} [description]
 */
var GetEaseFunction = function (ease, easeParams)
{
    //  Default ease function
    var easeFunction = EaseMap.Power0;

    //  Prepare ease function
    if (typeof ease === 'string' && EaseMap.hasOwnProperty(ease))
    {
        //  String based look-up
        easeFunction = EaseMap[ease];
    }
    else if (typeof ease === 'function')
    {
        //  Custom function
        easeFunction = ease;
    }
    else if (Array.isArray(ease) && ease.length === 4)
    {
        //  Bezier function (TODO)
    }

    //  No custom ease parameters?
    if (!easeParams)
    {
        //  Return ease function
        return easeFunction;
    }

    var cloneParams = easeParams.slice(0);

    cloneParams.unshift(0);

    //  Return ease function with custom ease parameters
    return function (v)
    {
        cloneParams[0] = v;

        return easeFunction.apply(this, cloneParams);
    };
};

module.exports = GetEaseFunction;
