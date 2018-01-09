/**
 * [description]
 *
 * @method Phaser.Scenes.GlobalSceneManager#sleep
 * @since 3.0.0
 *
 * @param {string} key - [description]
 */
var Sleep = function (key)
{
    var entry = this.getActiveScene(key);

    if (entry)
    {
        entry.scene.sys.sleep();
    }
};

module.exports = Sleep;
