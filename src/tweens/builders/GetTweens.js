/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetValue = require('../../utils/object/GetValue');

/**
 * [description]
 *
 * @function Phaser.Tweens.Builders.GetTweens
 * @since 3.0.0
 *
 * @param {object} config - [description]
 *
 * @return {array} [description]
 */
var GetTweens = function (config)
{
    var tweens = GetValue(config, 'tweens', null);

    if (tweens === null)
    {
        return [];
    }
    else if (typeof tweens === 'function')
    {
        tweens = tweens.call();
    }

    if (!Array.isArray(tweens))
    {
        tweens = [ tweens ];
    }

    return tweens;
};

module.exports = GetTweens;
