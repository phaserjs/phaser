/**
 * [description]
 *
 * @method Phaser.Scenes.GlobalSceneManager#loadComplete
 * @since 3.0.0
 *
 * @param {object} event - [description]
 */
var LoadComplete = function (event)
{
    var scene = event.loader.scene;

    this.create(scene);
};

module.exports = LoadComplete;
