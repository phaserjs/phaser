/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var EaseMap = require('../../math/easing/EaseMap');

/**
 * [description]
 *
 * @function Phaser.Tweens.Builders.GetEaseFunction
 * @since 3.0.0
 *
 * @param {string|function} ease - [description]
 * @param {array} easeParams - [description]
 *
 * @return {function} [description]
 */
var GetEaseFunction = function (ease, easeParams)
{
    if (typeof ease === 'string' && EaseMap.hasOwnProperty(ease))
    {
        if (easeParams)
        {
            var cloneParams = easeParams.slice(0);

            cloneParams.unshift(0);

            return function (v)
            {
                cloneParams[0] = v;

                return EaseMap[ease].apply(this, cloneParams);
            };
        }
        else
        {
            //  String based look-up
            return EaseMap[ease];
        }
    }
    else if (typeof ease === 'function')
    {
        //  Custom function
        return ease;
    }
    else if (Array.isArray(ease) && ease.length === 4)
    {
        //  Bezier function (TODO)
    }

    return EaseMap.Power0;
};

module.exports = GetEaseFunction;
