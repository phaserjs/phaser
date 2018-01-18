var GameObjectCreator = require('../GameObjectCreator');
var Group = require('./Group');

//  When registering a factory function 'this' refers to the GameObjectCreator context.

GameObjectCreator.register('group', function (config)
{
    return new Group(this.scene, null, config);
});
