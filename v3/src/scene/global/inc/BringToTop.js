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
    if (typeof scene === 'string') { scene = this.getScene(scene); }

    var index = this.getActiveSceneIndex(scene);

    if (index >= 0 && index < this.active.length - 1)
    {
        // Move the scene to the front of the active scenes array
        this.active.splice(index, 1);
        this.active.push(scene);

        // Move the scene in front of all active scenes in the scenes array
        this.scenes.splice(this.getSceneIndex(scene), 1);
        index = this.getSceneIndex(this.active[this.active.length - 2]);
        this.scenes.splice(index + 1, 0, scene);
    }
};

module.exports = BringToTop;
