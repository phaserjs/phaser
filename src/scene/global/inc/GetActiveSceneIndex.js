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
    for (var i = 0; i < this.active.length; i++)
    {
        if (this.active[i].scene === scene)
        {
            return this.active[i].index;
        }
    }

    return -1;
};

module.exports = GetActiveSceneIndex;
