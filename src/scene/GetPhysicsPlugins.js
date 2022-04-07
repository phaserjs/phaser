/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetFastValue = require('../utils/object/GetFastValue');
var UppercaseFirst = require('../utils/string/UppercaseFirst');

/**
 * Builds an array of which physics plugins should be activated for the given Scene.
 *
 * @function Phaser.Scenes.GetPhysicsPlugins
 * @since 3.0.0
 *
 * @param {Phaser.Scenes.Systems} sys - The scene system to get the physics systems of.
 *
 * @return {array} An array of Physics systems to start for this Scene.
 */
var GetPhysicsPlugins = function (sys)
{
    var defaultSystem = sys.game.config.defaultPhysicsSystem;
    var sceneSystems = GetFastValue(sys.settings, 'physics', false);

    if (!defaultSystem && !sceneSystems)
    {
        //  No default physics system or systems in this scene
        return;
    }

    //  Let's build the systems array
    var output = [];

    if (defaultSystem)
    {
        output.push(UppercaseFirst(defaultSystem + 'Physics'));
    }

    if (sceneSystems)
    {
        for (var key in sceneSystems)
        {
            key = UppercaseFirst(key.concat('Physics'));

            if (output.indexOf(key) === -1)
            {
                output.push(key);
            }
        }
    }

    //  An array of Physics systems to start for this Scene
    return output;
};

module.exports = GetPhysicsPlugins;
