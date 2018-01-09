//  Gets the Active scene at the given position

/**
 * [description]
 *
 * @method Phaser.Scenes.GlobalSceneManager#getSceneAt
 * @since 3.0.0
 *
 * @param {integer} index - [description]
 *
 * @return {Phaser.Scene} [description]
 */
var GetSceneAt = function (index)
{
    if (this.active[index])
    {
        return this.active[index].scene;
    }
};

module.exports = GetSceneAt;
