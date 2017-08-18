var LoadComplete = function (event)
{
    var scene = event.loader.scene;

    this.create(scene);
};

module.exports = LoadComplete;
