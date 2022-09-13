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
var camera;
var text;
var xAxis;
var yAxis;
var zAxis;
var isPosition = true;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.scenePlugin('Camera3DPlugin', 'plugins/camera3d.min.js', 'Camera3DPlugin', 'cameras3d');

    this.load.image('block', 'assets/sprites/block.png');
    this.load.spritesheet('positionButton', 'assets/ui/position-button.png', { frameWidth: 74, frameHeight: 23 });
    this.load.spritesheet('rotationButton', 'assets/ui/rotation-button.png', { frameWidth: 74, frameHeight: 23 });
}

function create ()
{
    camera = this.cameras3d.add(90).setPosition(0, 0, 500);

    createDotCube(camera, 6, 64, 'block');

    cursors = this.input.keyboard.createCursorKeys();

    var pButton = this.add.image(10, 10, 'positionButton', 0).setOrigin(0).setDepth(1000000).setName('position').setInteractive();
    var rButton = this.add.image(100, 10, 'rotationButton', 1).setOrigin(0).setDepth(1000000).setName('rotation').setInteractive();

    this.input.on('gameobjectdown', function (pointer, gameObject) {

        if (gameObject.name === 'position' && !isPosition)
        {
            //  Enable position
            pButton.setFrame(0);
            rButton.setFrame(1);
            isPosition = true;
        }
        else if (gameObject.name === 'rotation' && isPosition)
        {
            //  Enable rotation
            pButton.setFrame(1);
            rButton.setFrame(0);
            isPosition = false;
        }

    });

    text = this.add.text(10, 48, '', { font: '16px Courier', fill: '#00ff00' }).setDepth(1000000);

    xAxis = new Phaser.Math.Vector3(1, 0, 0);
    yAxis = new Phaser.Math.Vector3(0, 1, 0);
    zAxis = new Phaser.Math.Vector3(0, 0, 1);
}

//  Create a dot cube centered on 0 x 0 x 0
function createDotCube (camera, size, spacing, key, frame)
{
    //  + Adjust for origin 0.5
    var i0 = 0.5 - (size / 2);
    var i1 = (size / 2);

    for (var z = i0; z < i1; z++)
    {
        for (var y = i0; y < i1; y++)
        {
            for (var x = i0; x < i1; x++)
            {
                var bx = x * spacing;
                var by = y * spacing;
                var bz = z * spacing;

                camera.create(bx, by, bz, key, frame);
            }
        }
    }
}

function update ()
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
                camera.z += 4;
            }
            else
            {
                camera.rotate(0.01, zAxis);
            }
        }
        else
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
    }
    else if (cursors.down.isDown)
    {
        if (cursors.shift.isDown)
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
        else
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
    }

    text.setText([
        'camera.x: ' + camera.x,
        'camera.y: ' + camera.y,
        'camera.z: ' + camera.z
    ]);
}
