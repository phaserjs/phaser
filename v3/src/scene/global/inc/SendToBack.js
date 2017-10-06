//  If the arguments are strings they are assumed to be keys, otherwise they are Scene objects
//  You can only swap the positions of Active (rendering / updating) Scenes. If a Scene is not active it cannot be moved.

/**
 * [description]
 *
 * @method Phaser.Scenes.GlobalSceneManager#sendToBack
 * @since 3.0.0
 *
 * @param {string|Phaser.Scene} scene - [description]
 */
var SendToBack = function (scene)
{
    var index = (typeof scene === 'string') ? this.getActiveSceneIndexByKey(scene) : this.getActiveSceneIndex(scene);

    if (index > 0)
    {
        var entry = this.active.splice(index, 1);

        this.active.unshift({ index: 0, scene: entry[0].scene });

        for (var i = 0; i < this.active.length; i++)
        {
            this.active[i].index = i;
        }
    }
};

module.exports = SendToBack;
