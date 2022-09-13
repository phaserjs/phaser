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
var sprite;
var text;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.scenePlugin('Camera3DPlugin', 'plugins/camera3d.min.js', 'Camera3DPlugin', 'cameras3d');

    this.load.image('tree', 'assets/tests/camera3d/tree.png');
}

function create ()
{
    camera = this.cameras3d.add(80, 800, 600).setPosition(0, 0, 400);

    sprite = camera.create(0, 0, 0, 'tree');

    cursors = this.input.keyboard.createCursorKeys();

    text = this.add.text(10, 10, '', { font: '16px Courier', color: '#000000' });
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
            camera.z += 16;
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
            camera.z -= 16;
        }
    }

    //  1000 to 600 = alpha 0 to 1

    sprite.gameObject.alpha = 1 - Phaser.Math.Percent(camera.z, 600, 1000);

    text.setText([
        'a: ' + sprite.gameObject.alpha,
        'camera.z: ' + camera.z
    ]);
}
