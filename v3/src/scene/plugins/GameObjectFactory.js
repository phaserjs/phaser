var Class = require('../../utils/Class');

var GameObjectFactory = new Class({

    initialize:

    function GameObjectFactory (scene)
    {
        this.scene = scene;

        this.displayList;
        this.updateList;
    },

    boot: function (sys)
    {
        this.displayList = sys.displayList;
        this.updateList = sys.updateList;
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

module.exports = GameObjectFactory;
