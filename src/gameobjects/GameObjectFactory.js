var Class = require('../utils/Class');
var PluginManager = require('../plugins/PluginManager');

var GameObjectFactory = new Class({

    initialize:

    function GameObjectFactory (scene)
    {
        //  The Scene that owns this plugin
        this.scene = scene;

        this.systems = scene.sys;

        this.systems.events.on('boot', this.boot, this);

        this.displayList;
        this.updateList;
    },

    boot: function ()
    {
        this.displayList = this.systems.displayList;
        this.updateList = this.systems.updateList;

        this.systems.events.on('shutdown', this.shutdown, this);
        this.systems.events.on('destroy', this.destroy, this);
    },

    existing: function (child)
    {
        if (child.renderCanvas || child.renderWebGL)
        {
            this.displayList.add(child);
        }

        if (child.preUpdate)
        {
            this.updateList.add(child);
        }

        return child;
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

//  Static method called directly by the Game Object factory functions

GameObjectFactory.register = function (type, factoryFunction)
{
    if (!GameObjectFactory.prototype.hasOwnProperty(type))
    {
        GameObjectFactory.prototype[type] = factoryFunction;
    }
};

PluginManager.register('GameObjectFactory', GameObjectFactory, 'add');

module.exports = GameObjectFactory;
