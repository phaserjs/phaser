/**
 * [description]
 *
 * @method Phaser.Scenes.GlobalSceneManager#getActiveSceneIndex
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - [description]
 *
 * @return {integer} [description]
 */
var GetActiveSceneIndex = function (scene)
{
    return this.active.indexOf(scene);
};

module.exports = GetActiveSceneIndex;
