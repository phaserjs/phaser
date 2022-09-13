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
var position;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.scenePlugin('Camera3DPlugin', 'plugins/camera3d.min.js', 'Camera3DPlugin', 'cameras3d');

    this.load.image('block', 'assets/sprites/128x128.png');
}

function create ()
{
    image = this.add.image(400, 300, 'block');

    //  the position of the image in 3D space
    position = new Phaser.Math.Vector4();

    camera = this.cameras3d.addOrthographicCamera(800, 600).setPosition(0, 0, 200);

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

    camera.project(position, image);

    image.setScale(image.z);

    text.setText([
        'camera.x: ' + camera.x,
        'camera.y: ' + camera.y,
        'camera.z: ' + camera.z,
        '',
        'image.x: ' + image.x,
        'image.y: ' + image.y,
        'image.z: ' + image.z
    ]);
}
