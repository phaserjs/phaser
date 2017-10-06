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
    var entry = this.getActiveScene(key);

    return (entry && entry.scene.sys.settings.active);
};

module.exports = IsActive;
