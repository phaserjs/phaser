var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var controls;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('grid', 'assets/pics/uv-grid-4096-ian-maclachlan.png');
}

function create ()
{
    this.add.image(0, 0, 'grid').setOrigin(0);

    var cursors = this.input.keyboard.createCursorKeys();

    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        acceleration: 0.02,
        drag: 0.0005,
        maxSpeed: 1.0
    };

    controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

    var cam = this.cameras.main;

    cam.setBounds(0, 0, 4096, 4096);
    cam.setZoom(2);

    this.input.on('pointerdown', pointer => {

        let p = cam.getWorldPoint(pointer.x, pointer.y);

        console.log(p);

    });
}

function update (time, delta)
{
    controls.update(delta);
}
