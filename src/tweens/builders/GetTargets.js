/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetValue = require('../../utils/object/GetValue');

/**
 * Extracts an array of targets from a Tween configuration object.
 *
 * The targets will be looked for in a `targets` property. If it's a function, its return value will be used as the result.
 *
 * @function Phaser.Tweens.Builders.GetTargets
 * @since 3.0.0
 *
 * @param {object} config - The configuration object to use.
 *
 * @return {array} An array of targets (may contain only one element), or `null` if no targets were specified.
 */
var GetTargets = function (config)
{
    var targets = GetValue(config, 'targets', null);

    if (targets === null)
    {
        return targets;
    }

    if (typeof targets === 'function')
    {
        targets = targets.call();
    }

    if (!Array.isArray(targets))
    {
        targets = [ targets ];
    }

    return targets;
};

module.exports = GetTargets;
