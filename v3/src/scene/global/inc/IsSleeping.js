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
    var scene = this.getActiveScene(key);

    return (scene && !scene.sys.settings.active && !scene.sys.settings.visible);
};

module.exports = IsSleeping;
