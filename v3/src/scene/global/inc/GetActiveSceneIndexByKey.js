/**
 * [description]
 *
 * @method Phaser.Scenes.GlobalSceneManager#getActiveSceneIndexByKey
 * @since 3.0.0
 *
 * @param {string} key - [description]
 *
 * @return {integer} [description]
 */
var GetActiveSceneIndexByKey = function (key)
{
    var scene = this.keys[key];

    return this.active.indexOf(scene);
};

module.exports = GetActiveSceneIndexByKey;
