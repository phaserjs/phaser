/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var RESERVED = require('../tween/ReservedProps');

/**
 * [description]
 *
 * @function Phaser.Tweens.Builders.GetProps
 * @since 3.0.0
 *
 * @param {object} config - The configuration object of the tween to get the target(s) from.
 *
 * @return {array} An array of all the targets the tween is operating on.
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
            if (key.substr(0, 1) !== '_')
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
            if (RESERVED.indexOf(key) === -1 && key.substr(0, 1) !== '_')
            {
                keys.push({ key: key, value: config[key] });
            }
        }
    }

    return keys;
};

module.exports = GetProps;
