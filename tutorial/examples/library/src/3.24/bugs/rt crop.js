var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#009900',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var rt;
var logo;
var controls;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('logo', 'assets/sprites/phaser3-logo-small.png');
    this.load.image('grid', 'assets/pics/uv-grid-diag.png');
}

function create ()
{
    rt = this.add.renderTexture(0, 0, 1024, 1024).setInteractive();

    rt.draw('grid');

    this.cameras.main.zoom = 0.5;
    this.cameras.main.setScroll(400, 300);

    var cursors = this.input.keyboard.createCursorKeys();

    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
        zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
        acceleration: 0.04,
        drag: 0.0005,
        maxSpeed: 1.0
    };

    controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
}

function update (time, delta)
{
    controls.update(delta);

    var x = Phaser.Math.Between(-3000, 3000);
    var y = Phaser.Math.Between(-3000, 3000);

    rt.draw('logo', x, y);
}
