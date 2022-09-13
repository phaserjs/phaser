var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    pixelArt: true,
    physics: {
        default: 'impact',
        impact: {
            gravity: 50,
            maxVelocity: 800,
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var controls;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('gems', 'assets/tests/columns/gems.png', 'assets/tests/columns/gems.json');
}

function create ()
{
    var wallThickness = 64;
    var sides = (wallThickness * 2) + 96;
    var worldBounds = new Phaser.Geom.Rectangle(0, 0, (800 * 4), (600 * 4));
    var spriteBounds = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(worldBounds), -sides, -sides);

    this.anims.create({ key: 'diamond', frames: this.anims.generateFrameNames('gems', { prefix: 'diamond_', end: 15, zeroPad: 4 }), repeat: -1 });
    this.anims.create({ key: 'prism', frames: this.anims.generateFrameNames('gems', { prefix: 'prism_', end: 6, zeroPad: 4 }), repeat: -1 });
    this.anims.create({ key: 'ruby', frames: this.anims.generateFrameNames('gems', { prefix: 'ruby_', end: 6, zeroPad: 4 }), repeat: -1 });
    this.anims.create({ key: 'square', frames: this.anims.generateFrameNames('gems', { prefix: 'square_', end: 14, zeroPad: 4 }), repeat: -1 });

    //  Create loads of random sprites

    var anims = [ 'diamond', 'prism', 'ruby', 'square' ];

    for (var i = 0; i < 100; i++)
    {
        var pos = Phaser.Geom.Rectangle.Random(spriteBounds);

        var block = this.impact.add.sprite(pos.x, pos.y, 'gems');

        block.setActiveCollision().setAvsB().setBounce(1);

        block.setVelocity(Phaser.Math.Between(200, 400), Phaser.Math.Between(200, 400));

        if (Math.random() > 0.5)
        {
            block.vel.x *= -1;
        }
        else
        {
            block.vel.y *= -1;
        }

        block.play(Phaser.Math.RND.pick(anims));
    }

    this.impact.world.setBounds(0, 0, worldBounds.width, worldBounds.height, wallThickness);

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

    this.add.text(0, 0, 'Use Cursors to scroll camera.\nQ / E to zoom in and out', { font: '18px Courier', fill: '#00ff00' });
}

function update (time, delta)
{
    controls.update(delta);
}
