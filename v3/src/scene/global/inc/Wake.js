/**
 * [description]
 *
 * @method Phaser.Scenes.GlobalSceneManager#wake
 * @since 3.0.0
 *
 * @param {string} key - [description]
 */
var Wake = function (key)
{
    var entry = this.getActiveScene(key);

    if (entry)
    {
        entry.scene.sys.wake();
    }
};

module.exports = Wake;
