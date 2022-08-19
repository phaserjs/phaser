/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var RESERVED = require('../tween/ReservedProps');

/**
 * Internal function used by the Tween Builder to return an array of properties
 * that the Tween will be operating on. It takes a tween configuration object
 * and then checks that none of the `props` entries start with an underscore, or that
 * none of the direct properties are on the Reserved list.
 *
 * @function Phaser.Tweens.Builders.GetProps
 * @since 3.0.0
 *
 * @param {Phaser.Types.Tweens.TweenBuilderConfig} config - The configuration object of the Tween to get the properties from.
 *
 * @return {string[]} An array of all the properties the tween will operate on.
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
