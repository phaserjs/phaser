var GameObjectCreator = require('../../scene/plugins/GameObjectCreator');
var Graphics = require('./Graphics');

//  When registering a factory function 'this' refers to the GameObjectCreator context.

GameObjectCreator.register('graphics', function (config)
{
    return new Graphics(this.scene, config);
});
