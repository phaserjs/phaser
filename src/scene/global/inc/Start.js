/**
 * [description]
 *
 * @method Phaser.Scenes.GlobalSceneManager#start
 * @since 3.0.0
 *
 * @param {string} key - [description]
 * @param {object} data - [description]
 */
var Start = function (key, data)
{
    if (data === undefined) { data = {}; }

    //  if not booted, then put scene into a holding pattern
    if (!this.game.isBooted)
    {
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
                loader.once('complete', this.payloadComplete, this);

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
