/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetValue = require('../../utils/object/GetValue');

/**
 * Returns an array of all tweens in the given config
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
