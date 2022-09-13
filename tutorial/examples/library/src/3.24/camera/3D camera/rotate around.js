var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var r = 0;
var cursors;
var camera;
var text;
// var sprite3D;
var middle;
var axis;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.scenePlugin('Camera3DPlugin', 'plugins/camera3d.min.js', 'Camera3DPlugin', 'cameras3d');

    this.load.image('block', 'assets/sprites/128x128-v2.png');
    this.load.image('ball', 'assets/sprites/shinyball.png');
}

function create ()
{
    camera = this.cameras3d.add(80, 800, 600).setPosition(0, 0, 0);

    //  Center this dot cube on 0x0x0
    for (var z = -3; z < 3; z++)
    {
        for (var y = -3; y < 3; y++)
        {
            for (var x = -3; x < 3; x++)
            {
                var bx = (x * 64);
                var by = (y * 64);
                var bz = (z * 64);

                camera.create(bx, by, bz, 'ball');
            }
        }
    }

    middle = new Phaser.Math.Vector3(0, 0, 0);
    axis = new Phaser.Math.Vector3(0, 0, 1);

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
            camera.y -= 4;
        }
        else
        {
            camera.z -= 4;
        }
    }
    else if (cursors.down.isDown)
    {
        if (cursors.shift.isDown)
        {
            camera.y += 4;
        }
        else
        {
            camera.z += 4;
        }
    }

    camera.rotateAround(middle, 0.001, axis);

    text.setText([
        'camera.x: ' + camera.x,
        'camera.y: ' + camera.y,
        'camera.z: ' + camera.z
    ]);
}
