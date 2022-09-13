var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#cdcdcd',
    scene: {
        preload: preload,
        create: create,
        update: update,
        pack: {
            files: [
                { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/3.8/SpinePluginDebug.js', sceneKey: 'spine' }
            ]
        }
    }
};

var controls;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('logo', 'assets/sprites/phaser.png');

    this.load.setPath('assets/spine/3.8/spineboy');

    this.load.spine('boy', 'spineboy-ess.json', 'spineboy-ess.atlas', false);
}

function create ()
{
    var anims = [ 'death', 'idle', 'jump', 'run', 'walk' ];

    for (var i = 0; i < 128; i++)
    {
        var s = Phaser.Math.FloatBetween(0.1, 0.5);
        var x = Phaser.Math.Between(150, 750 * 6);
        var y = Phaser.Math.Between(200, 600);

        this.add.spine(x, y, 'boy', Phaser.Utils.Array.GetRandom(anims), true).setScale(s).setName('s' + i);
    }

    var cursors = this.input.keyboard.createCursorKeys();

    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
        zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
        acceleration: 0.35,
        drag: 0.01,
        maxSpeed: 1.2
    };

    controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
}

function update (time, delta)
{
    controls.update(delta);
}
