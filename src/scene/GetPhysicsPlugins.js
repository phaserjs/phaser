/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetFastValue = require('../utils/object/GetFastValue');
var UppercaseFirst = require('../utils/string/UppercaseFirst');

/**
 * Builds an array of which physics plugins should be activated for the given Scene.
 *
 * It checks both the global default physics system defined in the Game configuration
 * and any scene-specific physics settings. Each unique physics plugin key is formatted
 * as a title-cased string with 'Physics' appended (e.g. 'arcade' becomes 'ArcadePhysics').
 * Returns `undefined` if neither a default system nor scene-level physics settings are found.
 *
 * @function Phaser.Scenes.GetPhysicsPlugins
 * @since 3.0.0
 *
 * @param {Phaser.Scenes.Systems} sys - The Scene Systems instance for which to resolve active physics plugins.
 *
 * @return {array} An array of physics plugin keys to start for this Scene, or `undefined` if none are configured.
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
