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
var sprite3D;
var xAxis;
var yAxis;
var zAxis;
var isPosition = false;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.scenePlugin('Camera3DPlugin', 'plugins/camera3d.min.js', 'Camera3DPlugin', 'cameras3d');

    this.load.image('block', 'assets/sprites/128x128-v2.png');
    this.load.spritesheet('positionButton', 'assets/ui/position-button.png', { frameWidth: 74, frameHeight: 23 });
    this.load.spritesheet('rotationButton', 'assets/ui/rotation-button.png', { frameWidth: 74, frameHeight: 23 });
}

function create ()
{
    camera = this.cameras3d.add(90).setPosition(0, 0, 200);

    sprite3D = camera.create(0, 0, 0, 'block');

    cursors = this.input.keyboard.createCursorKeys();

    var pButton = this.add.image(10, 10, 'positionButton', 1).setOrigin(0).setDepth(1000000).setName('position').setInteractive();
    var rButton = this.add.image(100, 10, 'rotationButton', 0).setOrigin(0).setDepth(1000000).setName('rotation').setInteractive();

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
            sprite3D.gameObject.rotation += 0.01;
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
            sprite3D.gameObject.rotation -= 0.01;
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
                sprite3D.gameObject.rotation += 0.01;
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
                sprite3D.gameObject.rotation += 0.01;
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
                sprite3D.gameObject.rotation -= 0.01;
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
                sprite3D.gameObject.rotation -= 0.01;
            }
        }
    }

    text.setText([
        'camera.x: ' + camera.x,
        'camera.y: ' + camera.y,
        'camera.z: ' + camera.z
    ]);
}
