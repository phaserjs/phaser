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
    var scene = this.getActiveScene(key);

    if (scene)
    {
        scene.sys.pause();
    }
};

module.exports = Pause;
