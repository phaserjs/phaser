var Class = require('../../utils/Class');

var GameObjectCreator = new Class({

    initialize:

    function GameObjectCreator (scene)
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

module.exports = GameObjectCreator;
