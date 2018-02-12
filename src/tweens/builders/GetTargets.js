/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetValue = require('../../utils/object/GetValue');

/**
 * [description]
 *
 * @function Phaser.Tweens.Builders.GetTargets
 * @since 3.0.0
 *
 * @param {object} config - [description]
 *
 * @return {array} [description]
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
