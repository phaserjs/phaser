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
    this.load.image('bg', 'assets/ui/undersea-bg.png');
    this.load.image('brain', 'assets/sprites/brain.png');
    this.load.image('truck', 'assets/sprites/astorm-truck.png');
    this.load.image('mask', 'assets/tests/camera/grunge-mask.png');
}

function create ()
{
    var bg = this.add.image(400, 300, 'bg');

    var debug = this.add.graphics();

    var container1 = this.add.container(400, 200);

    var sprite0 = this.add.sprite(-400, 0, 'brain');
    var sprite1 = this.add.sprite(-200, 0, 'brain');
    var sprite2 = this.add.sprite(0, 0, 'brain');
    var sprite3 = this.add.sprite(200, 0, 'brain');
    var sprite4 = this.add.sprite(400, 0, 'brain');

    container1.add([ sprite0, sprite1, sprite2, sprite3, sprite4 ]);

    var container2 = this.add.container(0, 150);

    var sprite5 = this.add.sprite(-400, 0, 'truck');
    var sprite6 = this.add.sprite(-200, 0, 'truck');
    var sprite7 = this.add.sprite(0, 0, 'truck');
    var sprite8 = this.add.sprite(200, 0, 'truck');
    var sprite9 = this.add.sprite(400, 0, 'truck');

    container2.add([ sprite5, sprite6, sprite7, sprite8, sprite9 ]);

    container1.add(container2);

    var container3 = this.add.container(0, 150);

    var sprite10 = this.add.sprite(-400, 0, 'brain');
    var sprite11 = this.add.sprite(-200, 0, 'brain');
    var sprite12 = this.add.sprite(0, 0, 'brain');
    var sprite13 = this.add.sprite(200, 0, 'brain');
    var sprite14 = this.add.sprite(400, 0, 'brain');

    container3.add([ sprite10, sprite11, sprite12, sprite13, sprite14 ]);

    container2.add(container3);

    //  Something completely outside the containers, should be fully un-masked
    var outside = this.add.image(0, 300, 'truck');

    this.tweens.add({
        targets: container1,
        angle: { value: 360, duration: 6000 },
        scaleX: { value: 0.5, duration: 3000, yoyo: true, ease: 'Quad.easeInOut' },
        scaleY: { value: 0.5, duration: 3000, yoyo: true, ease: 'Quad.easeInOut' },
        repeat: -1
    });

    this.tweens.add({
        targets: outside,
        x: 800,
        yoyo: true,
        duration: 2000,
        repeat: -1
    });

    debug.fillStyle(0xff0000, 0.2);
    debug.fillCircle(300, 300, 200);
    debug.fillCircle(500, 300, 200);

    var maskImage = this.make.image({
        x: 400,
        y: 300,
        key: 'mask',
        add: false
    });

    var bitmask1 = maskImage.createBitmapMask();

    var shape1 = this.make.graphics().fillRect(50, 50, 700, 500);
    var shape2 = this.make.graphics().fillCircle(300, 300, 200);
    var shape3 = this.make.graphics().fillCircle(500, 300, 200);

    var geomask1 = shape1.createGeometryMask();
    var geomask2 = shape2.createGeometryMask();
    var geomask3 = shape3.createGeometryMask();

    geomask1.invertAlpha = false;
    // geomask2.invertAlpha = true;
    geomask3.invertAlpha = true;

    // this.cameras.main.setMask(geomask1);
    // this.cameras.main.setMask(bitmask1, true);
    this.cameras.main.setMask(bitmask1, false);

    // container1.setMask(geomask1);
    container2.setMask(geomask2);
    outside.setMask(geomask3);

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
