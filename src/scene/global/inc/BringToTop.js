//  If the arguments are strings they are assumed to be keys, otherwise they are Scene objects
//  You can only swap the positions of Active (rendering / updating) Scenes. If a Scene is not active it cannot be moved.

/**
 * [description]
 *
 * @method Phaser.Scenes.GlobalSceneManager#bringToTop
 * @since 3.0.0
 *
 * @param {string|Phaser.Scene} scene - [description]
 */
var BringToTop = function (scene)
{
    var index = (typeof scene === 'string') ? this.getActiveSceneIndexByKey(scene) : this.getActiveSceneIndex(scene);

    if (index < this.active.length)
    {
        var i = 0;
        var entry = this.active.splice(index, 1);

        for (i = 0; i < this.active.length; i++)
        {
            this.active[i].index = i;
        }

        this.active.push({ index: i, scene: entry[0].scene });
    }
};

module.exports = BringToTop;
