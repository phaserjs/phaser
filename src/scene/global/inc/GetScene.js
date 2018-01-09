/**
 * [description]
 *
 * @method Phaser.Scenes.GlobalSceneManager#getScene
 * @since 3.0.0
 *
 * @param {string} key - [description]
 *
 * @return {Phaser.Scene} [description]
 */
var GetScene = function (key)
{
    return this.keys[key];
};

module.exports = GetScene;
