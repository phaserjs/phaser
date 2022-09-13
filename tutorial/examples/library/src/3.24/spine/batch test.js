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
                { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/SpinePlugin.js', sceneKey: 'spine' }
            ]
        }
    }
};

var controls;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('logo', 'assets/sprites/phaser.png');

    this.load.setPath('assets/spine/demos/');

    this.load.spine('set1', 'demos.json', [ 'atlas1.atlas' ], true);
}

function create ()
{
    var anims = [ 'death', 'idle', 'jump', 'run', 'walk' ];

    for (var i = 0; i < 64; i++)
    {
        var s = Phaser.Math.FloatBetween(0.1, 0.5);
        var x = Phaser.Math.Between(50, 750 * 12);
        var y = Phaser.Math.Between(100, 600);

        this.add.spine(x, y, 'set1.spineboy', Phaser.Utils.Array.GetRandom(anims), true).setScale(s);
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
