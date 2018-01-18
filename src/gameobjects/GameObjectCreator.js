var Class = require('../utils/Class');
var PluginManager = require('../plugins/PluginManager');

var GameObjectCreator = new Class({

    initialize:

    function GameObjectCreator (scene)
    {
        //  The Scene that owns this plugin
        this.scene = scene;

        this.systems = scene.sys;

        if (!scene.sys.settings.isBooted)
        {
            scene.sys.events.once('boot', this.boot, this);
        }

        this.displayList;
        this.updateList;
    },

    boot: function ()
    {
        this.displayList = this.systems.displayList;
        this.updateList = this.systems.updateList;

        var eventEmitter = this.systems.events;

        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
    },

    shutdown: function ()
    {
        //  TODO
    },

    destroy: function ()
    {
        this.scene = null;
        this.displayList = null;
        this.updateList = null;
    }

});

//  Static method called directly by the Game Object creator functions

GameObjectCreator.register = function (type, factoryFunction)
{
    if (!GameObjectCreator.prototype.hasOwnProperty(type))
    {
        GameObjectCreator.prototype[type] = factoryFunction;
    }
};

PluginManager.register('GameObjectCreator', GameObjectCreator, 'make');

module.exports = GameObjectCreator;
