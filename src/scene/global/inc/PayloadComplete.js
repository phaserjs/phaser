/**
 * [description]
 *
 * @method Phaser.Scenes.GlobalSceneManager#payloadComplete
 * @since 3.0.0
 *
 * @param {object} event - [description]
 */
var PayloadComplete = function (event)
{
    var scene = event.loader.scene;

    this.bootScene(scene);
};

module.exports = PayloadComplete;
