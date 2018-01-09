/**
 * [description]
 *
 * @method Phaser.Scenes.GlobalSceneManager#resume
 * @since 3.0.0
 *
 * @param {string} key - [description]
 */
var Resume = function (key)
{
    var entry = this.getActiveScene(key);

    if (entry)
    {
        entry.scene.sys.resume();
    }
};

module.exports = Resume;
