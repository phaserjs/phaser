var SortScenes = require('./SortScenes');

/**
 * [description]
 *
 * @method Phaser.Scenes.GlobalSceneManager#stop
 * @since 3.0.0
 *
 * @param {string} key - [description]
 */
var Stop = function (key)
{
    var entry = this.getActiveScene(key);

    if (entry)
    {
        entry.scene.sys.shutdown();

        //  Remove from the active list
        var index = this.active.indexOf(entry);

        if (index !== -1)
        {
            this.active.splice(index, 1);

            this.active.sort(SortScenes);
        }
    }
};

module.exports = Stop;
