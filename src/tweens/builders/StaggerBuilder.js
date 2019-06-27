/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Creates a Stagger function.
 *
 * @function Phaser.Tweens.Builders.StaggerBuilder
 * @since 3.19.0
 *
 * @param {Phaser.Types.Tweens.StaggerBuilderConfig} config - Configuration for the new Tween.
 *
 * @return {function} The new tween.
 */
var StaggerBuilder = function (config)
{
    var result;

    var t = typeof(config);

    if (t === 'number')
    {
        result = function (index, total, target)
        {
            return index * config;
        };
    }

    return result;
};

module.exports = StaggerBuilder;
