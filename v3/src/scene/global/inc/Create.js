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
    //  Insert at the correct index, or it just all goes wrong :)

    var i = this.getSceneIndex(scene),
        insertAfter = -1;

    if (i > 0)
    {
        while (i--)
        {
            insertAfter = this.getActiveSceneIndex(this.scenes[i]);

            if (insertAfter >= 0) { break; }
        }
    }
    this.active.splice(insertAfter + 1, 0, scene);

    if (scene.create)
    {
        scene.create.call(scene, scene.sys.settings.data);
    }
};

module.exports = Create;
