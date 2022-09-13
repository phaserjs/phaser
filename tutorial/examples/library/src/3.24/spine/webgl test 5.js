var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
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

    this.load.setPath('assets/animations/spine/webgl/');

    this.load.spine('raptor', 'raptor-pro.json', 'raptor.atlas');
    this.load.spine('vine', 'vine-pro.json', 'vine.atlas');
    this.load.spine('coin', 'coin-pro.json', 'coin.atlas');
    this.load.spine('tank', 'tank-pro.json', 'tank.atlas');
    // this.load.spine('goblins', 'goblins-pro.json', 'goblins.atlas');
}

function create ()
{
    this.add.image(0, 0, 'logo').setOrigin(0);

    this.add.spine(100, 550, 'vine', 'grow', true).setScale(0.7);
    this.add.spine(400, 550, 'vine', 'grow', true).setScale(0.6);
    this.add.spine(700, 550, 'vine', 'grow', true).setScale(0.65);

    this.add.spine(700, 200, 'coin', 'rotate', true).setScale(0.3);

    this.add.spine(700, 520, 'tank', 'shoot', true).setScale(0.25);

    this.add.spine(200, 520, 'raptor', 'roar', true).setScale(0.3);

    // this.add.spine(200, 520, 'goblins', 'walk', true).setScale(0.3);

    var cursors = this.input.keyboard.createCursorKeys();

    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
        zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
        acceleration: 0.5,
        drag: 0.01,
        maxSpeed: 1.2
    };

    controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
}

function update (time, delta)
{
    controls.update(delta);
}
