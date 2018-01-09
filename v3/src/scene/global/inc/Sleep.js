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
    var scene = this.getActiveScene(key);

    if (scene)
    {
        scene.sys.sleep();
    }
};

module.exports = Sleep;
