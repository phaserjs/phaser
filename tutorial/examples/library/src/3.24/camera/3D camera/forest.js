var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#72dea3',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var cursors;
var camera;
var text;
var sky;
var horizon;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.scenePlugin('Camera3DPlugin', 'plugins/camera3d.min.js', 'Camera3DPlugin', 'cameras3d');

    this.load.image('bg', 'assets/tests/camera3d/bg.png');
    this.load.image('horizon', 'assets/tests/camera3d/horizon-wide.png');
    this.load.image('tree', 'assets/tests/camera3d/tree.png');
}

function create ()
{
    sky = this.add.image(400, 250, 'bg').setDepth(-5000);
    horizon = this.add.image(400, 300, 'horizon').setDepth(-4000);

    camera = this.cameras3d.add(20, 800, 600).setPosition(1500, -70, 10000);

    for (var z = 0; z < 32; z++)
    {
        for (var x = 0; x < 32; x++)
        {
            var xDiff = Phaser.Math.Between(-40, 40);
            var zDiff = Phaser.Math.Between(-60, 60);

            var bx = (x * 100) + xDiff;
            var bz = (z * 300) + zDiff;

            camera.create(bx, 0, bz, 'tree');
        }
    }

    cursors = this.input.keyboard.createCursorKeys();

    text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });
}

function update ()
{
    if (cursors.left.isDown)
    {
        camera.x -= 4;
    }
    else if (cursors.right.isDown)
    {
        camera.x += 4;
    }

    if (cursors.up.isDown)
    {
        if (cursors.shift.isDown)
        {
            camera.y = Phaser.Math.Clamp(camera.y - 4, -200, 30);
        }
        else
        {
            camera.z -= 16;
        }
    }
    else if (cursors.down.isDown)
    {
        if (cursors.shift.isDown)
        {
            camera.y = Phaser.Math.Clamp(camera.y + 4, -200, 30);
        }
        else
        {
            camera.z += 16;
        }
    }

    text.setText([
        'camera.x: ' + camera.x,
        'camera.y: ' + camera.y,
        'camera.z: ' + camera.z
    ]);
}
