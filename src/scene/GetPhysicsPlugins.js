var GetFastValue = require('../utils/object/GetFastValue');
var UppercaseFirst = require('../utils/string/UppercaseFirst');

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
