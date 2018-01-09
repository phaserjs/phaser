/**
 * [description]
 *
 * @method Phaser.Scenes.GlobalSceneManager#getSceneIndex
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - [description]
 *
 * @return {integer} [description]
 */
var GetSceneIndex = function (scene)
{
    return this.scenes.indexOf(scene);
};

module.exports = GetSceneIndex;
