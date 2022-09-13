//  You cannot do this until `SpinePlugin` is available
//  which it isn't until the plugin has loaded.
function createNewClass ()
{
    window.Enemy = new Phaser.Class({

        Extends: SpinePlugin.SpineGameObject,

        initialize:

        function Enemy (scene, x, y, skeleton, animation)
        {
            // SpinePlugin.SpineGameObject.call(this, scene, scene.sys.SpinePlugin, x, y, skeleton, animation, true);
            SpinePlugin.SpineGameObject.call(this, scene, scene.spine, x, y, skeleton, animation, true);

            scene.sys.displayList.add(this);
            scene.sys.updateList.add(this);
        }
    });
}

var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    scene: {
        preload: preload,
        create: create,
        pack: {
            files: [
                { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/3.8.95/SpinePluginDebug.js', sceneKey: 'spine' }
            ]
        }
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.setPath('assets/spine/3.8/demos/');

    this.load.spine('set1', 'demos.json', [ 'atlas1.atlas' ], true);
}

function create ()
{
    createNewClass();

    var boy = new Enemy(this, 400, 600, 'set1.spineboy', 'idle');

    console.log(boy);
}
