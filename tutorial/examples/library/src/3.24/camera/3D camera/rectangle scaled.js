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

var text;
var camera;
var cursors;
var transform;
var xAxis;
var yAxis;
var zAxis;
var isPosition = true;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.scenePlugin('Camera3DPlugin', 'plugins/camera3d.min.js', 'Camera3DPlugin', 'cameras3d');

    this.load.image('particle', 'assets/sprites/phaser-dude.png');
}

function create ()
{
    graphics = this.add.graphics();

    camera = this.cameras3d.add(85).setZ(300).setPixelScale(128);

    var sprites = camera.createRect({ x: 4, y: 4, z: 16 }, { x: 48, y: 48, z: 32 }, 'particle');

    //  Our rotation matrix
    transform = new Phaser.Math.Matrix4().rotateX(-0.01).rotateY(-0.02).rotateZ(0.01);

    cursors = this.input.keyboard.createCursorKeys();

    text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });

    xAxis = new Phaser.Math.Vector3(1, 0, 0);
    yAxis = new Phaser.Math.Vector3(0, 1, 0);
    zAxis = new Phaser.Math.Vector3(0, 0, 1);
}

function update ()
{
    // camera.transformChildren(transform);

    updateCamControls();
}

function updateCamControls ()
{
    if (cursors.left.isDown)
    {
        if (isPosition)
        {
            camera.x -= 4;
        }
        else
        {
            camera.rotate(0.01, xAxis);
        }
    }
    else if (cursors.right.isDown)
    {
        if (isPosition)
        {
            camera.x += 4;
        }
        else
        {
            camera.rotate(-0.01, xAxis);
        }
    }

    if (cursors.up.isDown)
    {
        if (cursors.shift.isDown)
        {
            if (isPosition)
            {
                camera.y += 4;
            }
            else
            {
                camera.rotate(0.01, yAxis);
            }
        }
        else
        {
            if (isPosition)
            {
                camera.z += 4;
            }
            else
            {
                camera.rotate(0.01, zAxis);
            }
        }
    }
    else if (cursors.down.isDown)
    {
        if (cursors.shift.isDown)
        {
            if (isPosition)
            {
                camera.y -= 4;
            }
            else
            {
                camera.rotate(-0.01, yAxis);
            }
        }
        else
        {
            if (isPosition)
            {
                camera.z -= 4;
            }
            else
            {
                camera.rotate(-0.01, zAxis);
            }
        }
    }

    text.setText([
        'camera.x: ' + camera.x,
        'camera.y: ' + camera.y,
        'camera.z: ' + camera.z
    ]);
}
