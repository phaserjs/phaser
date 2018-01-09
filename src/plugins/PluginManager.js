var Class = require('../utils/Class');
var ProcessQueue = require('../structs/ProcessQueue');

var PluginManager = new Class({

    initialize:

    function PluginManager (scene)
    {
        //  The Manager always has to belong to a Scene
        this.scene = scene;

        this.plugins = [];
    },



});

//  Static method called directly by the Game Object factory functions

// GameObjectFactory.register = function (type, factoryFunction)
// {
//     if (!GameObjectFactory.prototype.hasOwnProperty(type))
//     {
//         GameObjectFactory.prototype[type] = factoryFunction;
//     }
// };

module.exports = PluginManager;
