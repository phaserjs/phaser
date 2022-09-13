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

var game = new Phaser.Game(config);

function preload ()
{
    this.load.scenePlugin('Camera3DPlugin', 'plugins/camera3d.min.js', 'Camera3DPlugin', 'cameras3d');

    this.load.image('block', 'assets/sprites/128x128-v2.png');
}

function create ()
{
    //  Camera at 0x0x200 and looking at 0x0x0
    camera = this.cameras3d.add(85).setPosition(0, 0, 200);

    //  Create a few images to check the perspective with
    image = camera.create(0, 0, 0, 'block');

    camera.create(-150, 0, -100, 'block');
    camera.create(300, -100, -200, 'block');

    cursors = this.input.keyboard.createCursorKeys();

    text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });
}

function update ()
{
    var obj = camera;
    // var obj = image;

    if (cursors.left.isDown)
    {
        obj.x -= 4;
    }
    else if (cursors.right.isDown)
    {
        obj.x += 4;
    }

    if (cursors.up.isDown)
    {
        if (cursors.shift.isDown)
        {
            obj.y -= 4;
        }
        else
        {
            obj.z -= 4;
        }
    }
    else if (cursors.down.isDown)
    {
        if (cursors.shift.isDown)
        {
            obj.y += 4;
        }
        else
        {
            obj.z += 4;
        }
    }

    camera.update();

    text.setText([
        'camera.x: ' + camera.x,
        'camera.y: ' + camera.y,
        'camera.z: ' + camera.z,
        '',
        'image.x: ' + image.position.x,
        'image.y: ' + image.position.y,
        'image.z: ' + image.position.z
    ]);
}
