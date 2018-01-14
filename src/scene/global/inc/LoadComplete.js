/**
 * [description]
 *
 * @method Phaser.Scenes.GlobalSceneManager#loadComplete
 * @since 3.0.0
 *
 * @param {object} event - [description]
 */
var LoadComplete = function (loader)
{
    var scene = loader.scene;

    this.create(scene);
};

module.exports = LoadComplete;
