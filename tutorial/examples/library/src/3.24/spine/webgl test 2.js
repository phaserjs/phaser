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
    // this.load.image('logo', 'assets/pics/remember-me.jpg');

    this.load.setPath('assets/animations/spine/');

    this.load.spine('boy', 'spineboy.json', 'spineboy.atlas');
}

function create ()
{
    // this.cameras.main.setAngle(20);
    // this.cameras.main.setZoom(0.5);

    this.add.image(0, 0, 'logo').setOrigin(0);

    // var spineBoy = this.add.spine(400, 550, 'boy', 'run', true);

    var spineBoy = this.add.spine(400, 600, 'boy', 'idle', true);

    spineBoy.drawDebug = true;
    // spineBoy.setScale(0.5);
    // spineBoy.setAngle(-45);

    // var spineBoy2 = this.add.spine(200, 400, 'boy', 'shoot', true);

    // spineBoy2.setScale(0.3);

    var cursors = this.input.keyboard.createCursorKeys();

    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
        zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
        acceleration: 0.8,
        drag: 0.01,
        maxSpeed: 1.4
    };

    controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
}

function update (time, delta)
{
    controls.update(delta);
}
