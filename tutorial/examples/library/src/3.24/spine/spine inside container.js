var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#2d2d66',
    scene: {
        preload: preload,
        create: create,
        update: update,
        pack: {
            files: [
                { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/SpinePluginDebug.js', sceneKey: 'spine' }
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

    this.load.spine('boy', 'spineboy-ess.json', 'spineboy.atlas', true);
    this.load.spine('coin', 'coin-pro.json', 'coin.atlas');
}

function create ()
{
    this.add.image(0, 0, 'logo').setOrigin(0);

    var spineBoy = this.add.spine(0, 0, 'boy', 'walk', true).setScale(0.5);
    var coin = this.add.spine(0, 0, 'coin', 'rotate', true).setScale(0.3);

    var container = this.add.container(400, 300, [ spineBoy, coin ]);

    this.tweens.add({
        targets: container,
        angle: 360,
        duration: 6000,
        repeat: -1
    });

    var cursors = this.input.keyboard.createCursorKeys();

    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        acceleration: 0.06,
        drag: 0.0005,
        maxSpeed: 1.0
    };

    controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
}

function update (time, delta)
{
    controls.update(delta);
}
