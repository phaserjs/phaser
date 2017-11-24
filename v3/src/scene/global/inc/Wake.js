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
    var scene = this.getActiveScene(key);

    if (scene)
    {
        scene.sys.wake();
    }
};

module.exports = Wake;
