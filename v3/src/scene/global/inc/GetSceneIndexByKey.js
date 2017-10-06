/**
 * [description]
 *
 * @method Phaser.Scenes.GlobalSceneManager#getSceneIndexByKey
 * @since 3.0.0
 *
 * @param {string} key - [description]
 *
 * @return {integer} [description]
 */
var GetSceneIndexByKey = function (key)
{
    var scene = this.keys[key];

    return this.scenes.indexOf(scene);
};

module.exports = GetSceneIndexByKey;
