var Container = require('./Container');
var GameObjectCreator = require('../GameObjectCreator');

//  When registering a factory function 'this' refers to the GameObjectCreator context.

GameObjectCreator.register('container', function (x, y)
{
    return new Container(this.scene, x, y);
});
