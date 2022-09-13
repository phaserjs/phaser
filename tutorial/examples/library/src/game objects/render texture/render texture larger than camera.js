var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#2d2d88',
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
    this.load.image('ayu', 'assets/pics/ayu.png');
}

function create ()
{
    var rt = this.add.renderTexture(0, 0, 1400, 1200);

    rt.fill(0x2d2d2d);

    for (var y = 0; y < 4; y++)
    {
        for (var x = 0; x < 4; x++)
        {
            rt.draw('ayu', x * 404, y * 371);
        }
    }

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

    this.add.text(10, 10, 'Cursors to move', { font: '16px Courier', fill: '#ffffff' }).setScrollFactor(0);
}

function update (time, delta)
{
    controls.update(delta);
}
