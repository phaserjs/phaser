//  If the arguments are strings they are assumed to be keys, otherwise they are Scene objects
//  You can only swap the positions of Active (rendering / updating) Scenes. If a Scene is not active it cannot be moved.

/**
 * [description]
 *
 * @method Phaser.Scenes.GlobalSceneManager#moveDown
 * @since 3.0.0
 *
 * @param {string|Phaser.Scene} scene - [description]
 */
var MoveDown = function (scene)
{
    var index = (typeof scene === 'string') ? this.getActiveSceneIndexByKey(scene) : this.getActiveSceneIndex(scene);

    if (index > 0)
    {
        var temp = this.active[index];
        this.active[index] = this.active[index - 1];
        this.active[index - 1] = temp;
    }
};

module.exports = MoveDown;
