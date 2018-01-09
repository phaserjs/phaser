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
    if (typeof scene === 'string') { scene = this.getScene(scene); }

    var index = this.getActiveSceneIndex(scene);

    if (index > 0)
    {
        // Move the scene to the back of the active scenes array
        this.active.splice(index, 1);
        this.active.unshift(scene);

        // Move the scene behind all active scenes in the scenes array
        this.scenes.splice(this.getSceneIndex(scene), 1);
        index = this.getSceneIndex(this.active[1]);
        this.scenes.splice(index, 0, scene);
    }
};

module.exports = SendToBack;
