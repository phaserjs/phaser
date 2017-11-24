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
    var scene = this.getActiveScene(key);

    if (scene)
    {
        scene.sys.resume();
    }
};

module.exports = Resume;
