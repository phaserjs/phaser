/**
 * [description]
 *
 * @method Phaser.Scenes.GlobalSceneManager#isActive
 * @since 3.0.0
 *
 * @param {string} key - [description]
 *
 * @return {boolean} [description]
 */
var IsActive = function (key)
{
    var scene = this.getActiveScene(key);

    return (scene && scene.sys.settings.active);
};

module.exports = IsActive;
