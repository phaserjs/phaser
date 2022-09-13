var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#4848f8',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var camera;
var cursors;
var road;
var speed = 3;
var startZ;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.scenePlugin('Camera3DPlugin', 'plugins/camera3d.min.js', 'Camera3DPlugin', 'cameras3d');

    this.load.spritesheet('strip', 'assets/sprites/stripes800x32-v2.png', { frameWidth: 800, frameHeight: 32 });
}

function create ()
{
    camera = this.cameras3d.add(80).setPosition(0, -40, 300).setPixelScale(48);

    road = camera.createRect({ x: 1, y: 1, z: 32 }, 24, 'strip', 0);

    startZ = road[0].z;

    for (var i = 0; i < road.length; i++)
    {
        var segment = road[i];

        // segment.adjustScaleX = false;

        if (i % 2 === 1)
        {
            segment.gameObject.setFrame(1);
        }
    }

    cursors = this.input.keyboard.createCursorKeys();

    text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });
}

function update ()
{
    //  Scroll the road
    for (var i = 0; i < road.length; i++)
    {
        var segment = road[i];

        segment.z += speed;

        if (segment.z > (camera.z + 32))
        {
            segment.z = startZ;
        }
    }

    var obj = camera;

    // if (cursors.left.isDown)
    // {
    //     obj.x -= 4;
    // }
    // else if (cursors.right.isDown)
    // {
    //     obj.x += 4;
    // }

    if (cursors.up.isDown)
    {
        // if (cursors.shift.isDown)
        // {
            obj.y -= 4;
        // }
        // else
        // {
        //     obj.z -= 4;
        // }
    }
    else if (cursors.down.isDown)
    {
        // if (cursors.shift.isDown)
        // {
            obj.y += 4;
        // }
        // else
        // {
        //     obj.z += 4;
        // }
    }

    camera.update();

    text.setText([
        'camera.x: ' + camera.x,
        'camera.y: ' + camera.y,
        'camera.z: ' + camera.z
    ]);
}
