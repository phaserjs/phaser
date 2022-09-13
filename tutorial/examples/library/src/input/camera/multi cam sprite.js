var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 1024,
    height: 768,
    backgroundColor: '#000000',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var gui;
var graphics;
var bounds;

var cam1;
var cam2;
var cam3;
var cam4;
var current;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('eye', 'assets/pics/lance-overdose-loader-eye.png');
    this.load.image('grid', 'assets/pics/debug-grid-1920x1920.png');
}

function create ()
{
    this.add.image(0, 0, 'grid').setOrigin(0).setAlpha(0.5);

    cam1 = this.cameras.main.setSize(512, 384).setName('Camera 1');
    cam2 = this.cameras.add(512, 0, 512, 384).setName('Camera 2');
    cam3 = this.cameras.add(0, 384, 512, 384).setName('Camera 3');
    cam4 = this.cameras.add(512, 384, 512, 384).setName('Camera 4');

    cam2.setScroll(563, 421).setZoom(0.3);
    cam3.setScroll(702, 811).setZoom(0.6).setRotation(1.03);

    current = cam1;
    current.setBackgroundColor('rgba(0,0,200,0.5)');

    graphics = this.add.graphics();

    //  Scene bounds
    bounds = new Phaser.Geom.Rectangle(0, 0, 1920, 1920);

    for (var i = 0; i < 32; i++)
    {
        var x = Phaser.Math.Between(bounds.left, bounds.right);
        var y = Phaser.Math.Between(bounds.top, bounds.bottom);

        var s = this.add.sprite(x, y, 'eye');

        s.setInteractive();
        s.setAngle(Phaser.Math.Between(0, 359));
        s.setScale(0.5 + Math.random());
    }

    this.input.on('gameobjectover', function (pointer, gameObject) {

        gameObject.setTint(0xff0000);

    });

    this.input.on('gameobjectout', function (pointer, gameObject) {

        gameObject.clearTint();

    });

    var cursors = this.input.keyboard.createCursorKeys();

    var camControl = (Phaser.Cameras.Controls.Smoothed) ? Phaser.Cameras.Controls.Smoothed : Phaser.Cameras.Controls.SmoothedKeyControl;

    controls = new camControl({
        camera: cam1,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
        zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
        acceleration: 0.06,
        drag: 0.0005,
        maxSpeed: 1.0
    });

    this.input.keyboard.on('keydown_SPACE', function (event) {

        if (current === cam1)
        {
            controls.setCamera(cam2);
            current.setBackgroundColor('#000000');
            current = cam2;
            current.setBackgroundColor('rgba(0,0,200,0.5)');
        }
        else if (current === cam2)
        {
            controls.setCamera(cam3);
            current.setBackgroundColor('#000000');
            current = cam3;
            current.setBackgroundColor('rgba(0,0,200,0.5)');
        }
        else if (current === cam3)
        {
            controls.setCamera(cam4);
            current.setBackgroundColor('#000000');
            current = cam4;
            current.setBackgroundColor('rgba(0,0,200,0.5)');
        }
        else if (current === cam4)
        {
            controls.setCamera(cam1);
            current.setBackgroundColor('#000000');
            current = cam1;
            current.setBackgroundColor('rgba(0,0,200,0.5)');
        }

    }, this);

    this.input.keyboard.on('keydown_Z', function (event) {

        controls.camera.rotation += 0.01;

    }, this);

    this.input.keyboard.on('keydown_X', function (event) {

        controls.camera.rotation -= 0.01;

    }, this);

    gui = new dat.GUI();

    var help = {
        move: 'Cursors',
        zoom: 'Q & E',
        rotate: 'Z & X',
        change: 'Space',
    }

    var p1 = gui.addFolder('Pointer');
    p1.add(this.input, 'x').listen();
    p1.add(this.input, 'y').listen();
    p1.add(help, 'move');
    p1.add(help, 'zoom');
    p1.add(help, 'rotate');
    p1.add(help, 'change');
    p1.open();

    var c1 = gui.addFolder('Camera 1');
    c1.add(cam1, 'x').listen();
    c1.add(cam1, 'y').listen();
    c1.add(cam1, 'scrollX').listen();
    c1.add(cam1, 'scrollY').listen();
    c1.add(cam1, 'rotation').min(0).step(0.01).listen();
    c1.add(cam1, 'zoom', 0.1, 2).step(0.1).listen();
    c1.open();

    var c2 = gui.addFolder('Camera 2');
    c2.add(cam2, 'x').listen();
    c2.add(cam2, 'y').listen();
    c2.add(cam2, 'scrollX').listen();
    c2.add(cam2, 'scrollY').listen();
    c2.add(cam2, 'rotation').min(0).step(0.01).listen();
    c2.add(cam2, 'zoom', 0.1, 2).step(0.1).listen();
    c2.open();

    var c3 = gui.addFolder('Camera 3');
    c3.add(cam3, 'x').listen();
    c3.add(cam3, 'y').listen();
    c3.add(cam3, 'scrollX').listen();
    c3.add(cam3, 'scrollY').listen();
    c3.add(cam3, 'rotation').min(0).step(0.01).listen();
    c3.add(cam3, 'zoom', 0.1, 2).step(0.1).listen();
    c3.open();

    var c4 = gui.addFolder('Camera 4');
    c4.add(cam4, 'x').listen();
    c4.add(cam4, 'y').listen();
    c4.add(cam4, 'scrollX').listen();
    c4.add(cam4, 'scrollY').listen();
    c4.add(cam4, 'rotation').min(0).step(0.01).listen();
    c4.add(cam4, 'zoom', 0.1, 2).step(0.1).listen();
    c4.open();
}

function update (time, delta)
{
    controls.update(delta);

    graphics.clear();

    graphics.lineStyle(1, 0x00ff00);
    graphics.strokeRectShape(bounds);
    graphics.lineBetween(0, 0, bounds.width, bounds.height);
    graphics.lineBetween(bounds.width, 0, 0, bounds.height);
}
