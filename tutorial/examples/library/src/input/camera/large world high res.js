var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
    },
    width: 800,
    height: 600,
    resolution: window.devicePixelRatio,
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
    this.load.image('block', 'assets/sprites/block.png');
}

function create ()
{
    this.cameras.main.setBounds(0, 0, 10000, 10000);

    var total = 1024;

    var text = this.add.text(10, 10, 'Cursors to move. Click boxes. Remaining: ' + total, { font: '16px Courier', fill: '#00ff00' }).setScrollFactor(0);

    var x = 0;
    var y = 0;
    var sx = 10000 / 32;

    for (var i = 0; i < total; i++)
    {
        var image = this.add.image(x, y, 'block').setInteractive();

        image.on('pointerup', function () {

            total--;
            text.setText('Cursors to move. Click boxes. Remaining: ' + total);
            this.destroy();

        })

        x += sx;

        if (i > 0 && i % 32 === 0)
        {
            x = 0;
            y += sx;
        }
    }

    var cursors = this.input.keyboard.createCursorKeys();

    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        acceleration: 0.04,
        drag: 0.0005,
        maxSpeed: 1.0
    };

    controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

    var cam = this.cameras.main;

    var gui = new dat.GUI();

    gui.addFolder('Camera');
    gui.add(cam.midPoint, 'x').listen();
    gui.add(cam.midPoint, 'y').listen();
    gui.add(cam, 'scrollX').listen();
    gui.add(cam, 'scrollY').listen();
    gui.add(cam, 'width').listen();
    gui.add(cam, 'height').listen();
    gui.add(cam, 'displayWidth').listen();
    gui.add(cam, 'displayHeight').listen();
    gui.add(cam, 'zoom', 0.1, 4).step(0.1);
}

function update (time, delta)
{
    controls.update(delta);
}

