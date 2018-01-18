var BuildGameObject = require('../BuildGameObject');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var LightLayer = require('./LightLayer');

//  When registering a factory function 'this' refers to the GameObjectCreator context.

GameObjectCreator.register('lightLayer', function (config)
{
    var pass = new LightLayer(this.scene);

    BuildGameObject(this.scene, pass, config);

    return pass;
});
