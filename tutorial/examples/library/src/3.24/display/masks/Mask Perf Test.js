var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    clearBeforeRender: true,
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
    this.load.image('bg', 'assets/ui/undersea-bg.png');
    this.load.image('brain', 'assets/sprites/brain.png');
    this.load.image('truck', 'assets/sprites/astorm-truck.png');
}

function create ()
{
    var bg = this.add.image(400, 300, 'bg');

    var shape = this.make.graphics().fillCircle(0, 0, 200);
    var mask = shape.createGeometryMask();

    //  Create lots of Sprites

    //  With no mask there are 7 WebGL ops (with 100 sprites)
    //  With mask per Sprite there are 155 WebGL ops (with just 10 sprites!) - even though they're all using the same mask

    for (var i = 0; i < 100; i++)
    {
        var x = Phaser.Math.Between(100, 700);
        var y = Phaser.Math.Between(100, 500);
        var dx = x + Phaser.Math.Between(-400, 400);
        var dy = y + Phaser.Math.Between(-400, 400);
        var duration = Phaser.Math.Between(2000, 4000);

        var sprite = this.add.sprite(x, y, 'brain');

        sprite.setMask(mask);

        this.tweens.add({
            targets: sprite,
            x: dx,
            y: dy,
            yoyo: true,
            duration: duration,
            ease: 'Sine.easeInOut',
            repeat: -1
        });
    }

    this.add.image(400, 300, 'truck');

    this.tweens.add({
        targets: shape,
        yoyo: true,
        repeat: -1,
        x: { value: 800, duration: 2000, ease: 'Sine.easeInOut'  },
        y: { value: 600, duration: 8000, ease: 'Sine.easeInOut' }
    });

    var cursors = this.input.keyboard.createCursorKeys();

    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
        zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
        acceleration: 0.03,
        drag: 0.0005,
        maxSpeed: 1.0
    };

    controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

    this.input.keyboard.on('keydown-Z', function (event) {

        this.cameras.main.rotation += 0.01;

    }, this);

    this.input.keyboard.on('keydown-X', function (event) {

        this.cameras.main.rotation -= 0.01;

    }, this);
}

function update (time, delta)
{
    controls.update(delta);
}
