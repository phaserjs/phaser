/**
 * [description]
 *
 * @method Phaser.Scenes.GlobalSceneManager#pause
 * @since 3.0.0
 *
 * @param {string} key - [description]
 */
var Pause = function (key)
{
    var entry = this.getActiveScene(key);

    if (entry)
    {
        entry.scene.sys.pause();
    }
};

module.exports = Pause;
