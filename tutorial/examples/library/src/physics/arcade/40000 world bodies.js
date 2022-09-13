var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            useTree: false,
            gravity: { y: 100 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var spriteBounds;
var blitter;
var controls;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('atlas', 'assets/tests/fruit/veg.png', 'assets/tests/fruit/veg.json');
}

function release ()
{
    for (var i = 0; i < 100; i++)
    {
        var pos = Phaser.Geom.Rectangle.Random(spriteBounds);

        var frame = 'veg0' + Phaser.Math.Between(1, 9).toString();

        var bob = blitter.create(pos.x, pos.y, frame);

        bob.angle = 0;
        bob.scaleX = 1;
        bob.scaleY = 1;
        bob.displayOriginX = 0;
        bob.displayOriginY = 0;

        this.physics.add.existing(bob);

        bob.body.setVelocity(Phaser.Math.Between(200, 400), Phaser.Math.Between(200, 400));
        bob.body.setBounce(1);
        bob.body.setCollideWorldBounds(true);

        if (Math.random() > 0.5)
        {
            bob.body.velocity.x *= -1;
        }

        if (Math.random() > 0.5)
        {
            bob.body.velocity.y *= -1;
        }
    }
}

function create ()
{
    this.physics.world.setBounds(0, 0, 800 * 8, 600 * 8);

    blitter = this.add.blitter(0, 0, 'atlas');

    spriteBounds = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(this.physics.world.bounds), -100, -100);

    //  Create 40,000 bodies at a rate of 100 bodies per 100ms
    this.time.addEvent({ delay: 100, callback: release, callbackScope: this, repeat: (40000 / 100) - 1 });

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

    this.cameras.main.scrollX = 2770;
    this.cameras.main.scrollY = 2036;
    this.cameras.main.zoom = 0.12;
}

function update (time, delta)
{
    controls.update(delta);
}
