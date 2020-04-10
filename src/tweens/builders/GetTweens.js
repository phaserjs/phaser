/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetValue = require('../../utils/object/GetValue');

/**
 * Internal function used by the Timeline Builder.
 * 
 * It returns an array of all tweens in the given timeline config.
 *
 * @function Phaser.Tweens.Builders.GetTweens
 * @since 3.0.0
 *
 * @param {Phaser.Types.Tweens.TimelineBuilderConfig} config - The configuration object for the Timeline.
 *
 * @return {Phaser.Tweens.Tween[]} An array of Tween instances that the Timeline will manage.
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
