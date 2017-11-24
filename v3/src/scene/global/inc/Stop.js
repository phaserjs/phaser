/**
 * [description]
 *
 * @method Phaser.Scenes.GlobalSceneManager#stop
 * @since 3.0.0
 *
 * @param {string} key - [description]
 */
var Stop = function (key)
{
    var scene = this.getActiveScene(key);

    if (scene)
    {
        scene.sys.shutdown();

        //  Remove from the active list
        var index = this.active.indexOf(scene);

        if (index !== -1)
        {
            this.active.splice(index, 1);
        }
    }
};

module.exports = Stop;
