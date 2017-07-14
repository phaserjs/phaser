var Start = function (key, data)
{
    if (data === undefined) { data = {}; }

    // console.log('start:', key);
    // console.dir(data);

    //  if not booted, then put scene into a holding pattern
    if (!this.game.isBooted)
    {
        // console.log('GlobalSceneManager not yet booted, setting autoStart on pending list');

        for (var i = 0; i < this._pending.length; i++)
        {
            var entry = this._pending[i];

            if (entry.key === key)
            {
                entry.autoStart = true;
                entry.data = data;
            }
        }

        return;
    }

    var scene = this.getScene(key);

    // console.log(scene);

    if (scene)
    {
        //  Already started? Nothing more to do here ...
        if (this.isActive(key))
        {
            return;
        }

        scene.sys.start(data);

        var loader = scene.sys.load;

        //  Files payload?
        if (loader && Array.isArray(scene.sys.settings.files))
        {
            loader.reset();

            if (loader.loadArray(scene.sys.settings.files))
            {
                loader.events.once('LOADER_COMPLETE_EVENT', this.payloadComplete.bind(this));

                loader.start();
            }
            else
            {
                this.bootScene(scene);
            }
        }
        else
        {
            this.bootScene(scene);
        }
    }
};

module.exports = Start;
