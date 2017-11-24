/**
 * [description]
 *
 * @method Phaser.Scenes.GlobalSceneManager#create
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - [description]
 */
var Create = function (scene)
{
    this.active.push(scene);

    if (scene.create)
    {
        scene.create.call(scene, scene.sys.settings.data);
    }
};

module.exports = Create;
