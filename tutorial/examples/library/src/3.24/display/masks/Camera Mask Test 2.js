var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    pixelArt: true,
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 0
            },
            debug: true
        }
    },
    scene: {
        create: create,
        update: update
    }
};

var controls;

var game = new Phaser.Game(config);

function create ()
{
    var shape = this.make.graphics();

    shape.fillStyle(0xffffff);
    shape.slice(400, 300, 200, Phaser.Math.DegToRad(340), Phaser.Math.DegToRad(30), true);
    shape.fillPath();

    var mask = shape.createGeometryMask();

    this.cameras.main.setMask(mask);

    var worldWidth = 1600;
    var worldHeight = 1200;

    this.matter.world.setBounds(0, 0, worldWidth, worldHeight);

    //  Create loads of random bodies
    for (var i = 0; i < 100; i++)
    {
        var x = Phaser.Math.Between(0, worldWidth);
        var y = Phaser.Math.Between(0, worldHeight);

        if (Math.random() < 0.7)
        {
            var sides = Phaser.Math.Between(3, 14);
            var radius = Phaser.Math.Between(8, 50);

            this.matter.add.polygon(x, y, sides, radius, { restitution: 0.9 });
        }
        else
        {
            var width = Phaser.Math.Between(16, 128);
            var height = Phaser.Math.Between(8, 64);

            this.matter.add.rectangle(x, y, width, height, { restitution: 0.9 });
        }
    }

    this.matter.add.mouseSpring();

    var cursors = this.input.keyboard.createCursorKeys();

    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
        zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
        acceleration: 0.06,
        drag: 0.0005,
        maxSpeed: 1.0
    };

    controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

    this.input.keyboard.on('KEY_DOWN_Z', function (event) {

        this.cameras.main.rotation += 0.01;

    }, 0, this);

    this.input.keyboard.on('KEY_DOWN_X', function (event) {

        this.cameras.main.rotation -= 0.01;

    }, 0, this);
}

function update (time, delta)
{
    controls.update(delta);
}
