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

var camera;
var cursors;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.scenePlugin('Camera3DPlugin', 'plugins/camera3d.min.js', 'Camera3DPlugin', 'cameras3d');

    this.load.image('ball', 'assets/sprites/aqua_ball.png');
}

function create ()
{
    camera = this.cameras3d.add(55).setPosition(0, -50, 200).setPixelScale(32);

    camera.createRect({ x: 8, y: 1, z: 8 }, 32, 'ball');

    cursors = this.input.keyboard.createCursorKeys();

    text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });
}

function update ()
{
    var obj = camera;

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
        'camera.z: ' + camera.z
    ]);
}
