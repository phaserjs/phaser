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

var cursors;
var image;
var camera;
var text;
var xAxis;
var yAxis;
var zAxis;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.scenePlugin('Camera3DPlugin', 'plugins/camera3d.min.js', 'Camera3DPlugin', 'cameras3d');

    this.load.image('block', 'assets/sprites/128x128-v2.png');
}

function create ()
{
    camera = this.cameras3d.add(85).setPosition(0, 0, 200);

    image = camera.create(0, 0, 0, 'block');

    cursors = this.input.keyboard.createCursorKeys();

    text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });

    xAxis = new Phaser.Math.Vector3(1, 0, 0);
    yAxis = new Phaser.Math.Vector3(0, 1, 0);
    zAxis = new Phaser.Math.Vector3(0, 0, 1);
}

function update ()
{
    if (cursors.left.isDown)
    {
        camera.rotate(0.001, xAxis);
        // camera.x -= 4;
    }
    else if (cursors.right.isDown)
    {
        camera.rotate(-0.001, xAxis);
        // camera.x += 4;
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

    text.setText([
        'camera.x: ' + camera.x,
        'camera.y: ' + camera.y,
        'camera.z: ' + camera.z,
        '',
        'image.x: ' + image.gameObject.x,
        'image.y: ' + image.gameObject.y,
        'image.z: ' + image.gameObject.z
    ]);
}
