var BootScene = function (scene)
{
    if (scene.init)
    {
        scene.init.call(scene, scene.sys.settings.data);
    }

    var loader = scene.sys.load;
        
    loader.reset();

    if (scene.preload)
    {
        scene.preload(this.game);

        //  Is the loader empty?
        if (loader.list.size === 0)
        {
            this.create(scene);
        }
        else
        {
            //  Start the loader going as we have something in the queue

            loader.events.once('LOADER_COMPLETE_EVENT', this.loadComplete.bind(this));

            loader.start();
        }
    }
    else
    {
        //  No preload? Then there was nothing to load either
        this.create(scene);
    }
};

module.exports = BootScene;
