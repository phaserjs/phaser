var PayloadComplete = function (event)
{
    var scene = event.loader.scene;

    // console.log('payloadComplete', scene.sys.settings.key);

    this.bootScene(scene);
};

module.exports = PayloadComplete;
