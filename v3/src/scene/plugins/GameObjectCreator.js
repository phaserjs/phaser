var Class = require('../../utils/Class');

var GameObjectCreator = new Class({

    initialize:

    function GameObjectCreator (scene)
    {
        this.scene = scene;
    },

    destroy: function ()
    {
        this.scene = null;
    }

});

//  Static method called directly by the Game Object creator functions

GameObjectCreator.register = function (type, factoryFunction)
{
    // console.log('register', type);

    if (!GameObjectCreator.prototype.hasOwnProperty(type))
    {
        GameObjectCreator.prototype[type] = factoryFunction;
    }
};

module.exports = GameObjectCreator;
