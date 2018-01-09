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
        this._start.push({key: key, data: data});

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
