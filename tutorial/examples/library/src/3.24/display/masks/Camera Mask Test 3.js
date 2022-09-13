var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000066',
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
    this.load.image('mask', 'assets/tests/camera/soft-mask.png');
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

    var bg = this.add.image(400, 300, 'bg');

    // var shape2 = this.make.graphics().fillCircle(400, 300, 200);
    // var mask2 = shape2.createGeometryMask();

    var maskImage2 = this.make.image({
        x: 400,
        y: 300,
        key: 'phaser2',
        add: false
    });

    var mask2 = maskImage2.createBitmapMask();

    var particles = this.add.particles('fish');

    var emitter1 = particles.createEmitter({
        frame: { frames: [ 0, 1, 2 ], cycle: true, quantity: 4 },
        x: -70,
        y: { min: 100, max: 500, steps: 8 },
        lifespan: 5000,
        speedX: { min: 200, max: 400, steps: 8 },
        quantity: 4,
        frequency: 500
    });

    var emitter2 = particles.createEmitter({
        frame: { frames: [ 0, 1, 2 ], cycle: true, quantity: 4 },
        x: 870,
        y: { min: 100, max: 500, steps: 8 },
        lifespan: 5000,
        speedX: { min: -200, max: -400, steps: 8 },
        quantity: 4,
        frequency: 500
    });

    // particles.visible = false;

    // bg.mask = new Phaser.Display.Masks.BitmapMask(this, particles);
    // bg.mask = new Phaser.Display.Masks.BitmapMask(this, particles);

    // bg.setMask(mask2);

    // this.cameras.main.setMask(new Phaser.Display.Masks.BitmapMask(this, particles));

    var shape1 = this.make.graphics().fillRect(50, 50, 700, 500);
    var shape2 = this.make.graphics().fillCircle(400, 300, 300);
    // var shape3 = this.make.graphics().fillCircle(400, 300, 100);
    var shape3 = this.make.graphics().fillRect(400, 0, 600, 600);

    // var shape1 = this.make.graphics().fillRect(200, 150, 400, 500);
    // var shape2 = this.make.graphics().fillCircle(400, 300, 300);

    var geomask1 = shape1.createGeometryMask();
    var geomask2 = shape2.createGeometryMask();
    var geomask3 = shape3.createGeometryMask();

    // geomask1.invertAlpha = false;
    // geomask2.invertAlpha = true;
    // geomask3.invertAlpha = true;

    // emitter.setMask(geomask);
    // emitter.setMask(mask);

    // particles.setMask(geomask1);
    // particles.setMask(geomask2);

    // particles.setMask(mask);
    // particles.setMask(mask2);

    // this.cameras.main.setMask(mask);

    this.cameras.main.setMask(geomask1);

    // particles.setMask(geomask2);

    emitter1.setMask(geomask2);
    emitter2.setMask(geomask3);

    // this.cameras.main.setMask(geomask2);
    // particles.setMask(mask2);


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
