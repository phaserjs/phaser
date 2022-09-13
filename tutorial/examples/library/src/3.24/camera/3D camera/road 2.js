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
var background;
var road;
var trees;
var speed = 3;
var startZ;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.scenePlugin('Camera3DPlugin', 'plugins/camera3d.min.js', 'Camera3DPlugin', 'cameras3d');

    this.load.spritesheet('bgStrip', 'assets/sprites/stripes800x32-bg.png', { frameWidth: 800, frameHeight: 32 });
    this.load.spritesheet('roadStrip', 'assets/sprites/stripes800x32-layer.png', { frameWidth: 100, frameHeight: 32 });
    this.load.image('treeLeft', 'assets/sprites/palm-tree-left.png');
    this.load.image('treeRight', 'assets/sprites/palm-tree-right.png');
}

function create ()
{
    camera = this.cameras3d.add(80).setPosition(0, -40, 300).setPixelScale(200);

    background = camera.createRect({ x: 1, y: 1, z: 32 }, 24, 'bgStrip', 0);

    startZ = background[0].z;

    for (var i = 0; i < background.length; i++)
    {
        var segment = background[i];

        segment.gameObject.scaleX = 1;
        segment.adjustScaleX = false;

        if (i % 2 === 1)
        {
            segment.gameObject.setFrame(1);
        }
    }

    road = camera.createRect({ x: 1, y: 1, z: 32 }, 24, 'roadStrip', 0);

    for (var i = 0; i < road.length; i++)
    {
        var segment = road[i];

        if (i % 2 === 1)
        {
            segment.gameObject.setFrame(1);
        }
    }

    trees = [];

    for (var i = 0; i < 12; i++)
    {
        trees.push(camera.create(-40, -60, i * 128, 'treeLeft'));
        trees.push(camera.create(40, -60, i * 128, 'treeRight'));
    }

    cursors = this.input.keyboard.createCursorKeys();

    text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });
}

function update ()
{
    //  Scroll the road

    for (var i = 0; i < background.length; i++)
    {
        var segment = background[i];

        segment.z += speed;

        if (segment.z > (camera.z + 32))
        {
            segment.z = startZ;
        }
    }

    for (var i = 0; i < road.length; i++)
    {
        var segment = road[i];

        segment.z += speed;

        if (segment.z > (camera.z + 32))
        {
            segment.z = startZ;
        }

        if (cursors.left.isDown)
        {
            segment.x -= 1;
        }
        else if (cursors.right.isDown)
        {
            segment.x += 1;
        }
    }

    for (var i = 0; i < trees.length; i++)
    {
        var segment = trees[i];

        segment.z += speed;

        if (segment.z > (camera.z + 32))
        {
            segment.z = startZ;
        }
    }

    var obj = camera;

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
