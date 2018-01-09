/**
 * [description]
 *
 * @method Phaser.Scenes.GlobalSceneManager#getActiveScene
 * @since 3.0.0
 *
 * @param {string} key - [description]
 *
 * @return {Phaser.Scene} [description]
 */
var GetActiveScene = function (key)
{
    var scene = this.getScene(key);

    if (this.active.indexOf(scene) >= 0)
    {
        return scene;
    }
};

module.exports = GetActiveScene;
