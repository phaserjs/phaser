var GameObjectFactory = require('../GameObjectFactory');
var RenderTexture = require('./RenderTexture');

GameObjectFactory.register('renderTexture', function (x, y, width, height)
{
    return this.displayList.add(new RenderTexture(this.scene, x, y, width, height));
});
