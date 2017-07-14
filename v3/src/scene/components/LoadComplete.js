var LoadComplete = function (event)
{
    var scene = event.loader.scene;

    // console.log('loadComplete', scene.sys.settings.key);

    this.create(scene);
};

module.exports = LoadComplete;
