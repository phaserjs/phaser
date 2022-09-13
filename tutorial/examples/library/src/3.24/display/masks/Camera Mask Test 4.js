var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000022',
    parent: 'phaser-example',
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
    this.load.image('image', 'assets/pics/sao-sinon.png');
    this.load.image('phaser2', 'assets/sprites/phaser2.png');
    this.load.image('mask', 'assets/tests/camera/grunge-mask.png');
    this.load.image('bg', 'assets/ui/undersea-bg.png');
    this.load.spritesheet('fish', 'assets/sprites/fish-136x80.png', { frameWidth: 136, frameHeight: 80 });
}

function create ()
{
    var maskImage = this.make.image({
        x: 400,
        y: 300,
        key: 'mask',
        add: false
    });

    var mask = maskImage.createBitmapMask();

    this.cameras.main.setMask(mask, false);

    // this.cameras.main.setSize(400, 300);

    // this.cameras.add(400, 0, 400, 300);
    // this.cameras.add(0, 300, 400, 300);
    // this.cameras.add(400, 300, 400, 300);

    this.add.image(400, 300, 'bg');

    var particles = this.add.particles('fish');

    particles.createEmitter({
        frame: { frames: [ 0, 1, 2 ], cycle: true, quantity: 4 },
        x: -70,
        y: { min: 100, max: 500, steps: 8 },
        lifespan: 5000,
        speedX: { min: 200, max: 400, steps: 8 },
        quantity: 4,
        frequency: 500
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
