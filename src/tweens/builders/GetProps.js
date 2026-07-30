/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var RESERVED = require('../tween/ReservedProps');

/**
 * Internal function used by the Tween Builder to extract the list of properties
 * that the Tween will animate. It takes a Tween configuration object and follows
 * one of two paths: if the config contains a `props` object, it iterates its keys
 * and skips any that begin with an underscore; otherwise, it iterates the top-level
 * config keys directly, skipping both any that begin with an underscore and any that
 * appear on the Reserved Properties list (e.g. `targets`, `delay`, `duration`).
 *
 * @function Phaser.Tweens.Builders.GetProps
 * @since 3.0.0
 *
 * @param {Phaser.Types.Tweens.TweenBuilderConfig} config - The configuration object of the Tween to get the properties from.
 *
 * @return {string[]} An array of `{ key, value }` objects representing each property the tween will animate.
 */
var GetProps = function (config)
{
    var key;
    var keys = [];

    //  First see if we have a props object

    if (config.hasOwnProperty('props'))
    {
        for (key in config.props)
        {
            //  Skip any property that starts with an underscore
            if (key.substring(0, 1) !== '_')
            {
                keys.push({ key: key, value: config.props[key] });
            }
        }
    }
    else
    {
        for (key in config)
        {
            //  Skip any property that is in the ReservedProps list or that starts with an underscore
            if (RESERVED.indexOf(key) === -1 && key.substring(0, 1) !== '_')
            {
                keys.push({ key: key, value: config[key] });
            }
        }
    }

    return keys;
};

module.exports = GetProps;
