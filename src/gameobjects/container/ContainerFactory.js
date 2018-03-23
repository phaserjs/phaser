var Container = require('./Container');
var GameObjectFactory = require('../GameObjectFactory');

GameObjectFactory.register('container', function (x, y)
{
    var container = new Container(this.scene, x, y);

    this.displayList.add(container);

    return container;
});
