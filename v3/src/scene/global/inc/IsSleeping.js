/**
 * [description]
 *
 * @method Phaser.Scenes.GlobalSceneManager#isSleeping
 * @since 3.0.0
 *
 * @param {string} key - [description]
 *
 * @return {boolean} [description]
 */
var IsSleeping = function (key)
{
    var entry = this.getActiveScene(key);

    if (entry)
    {
        return (!entry.scene.sys.settings.active && !entry.scene.sys.settings.visible);
    }

    return false;
};

module.exports = IsSleeping;
