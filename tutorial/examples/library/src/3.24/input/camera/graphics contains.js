var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    scene: {
        create: create,
        update: update
    }
};

var gui;
var graphics;
var bounds;
var rect1;
var rect2;
var circle1;
var circle2;
var triangle1;
var px;
var py;
var hitShape = null;

var game = new Phaser.Game(config);

function create ()
{
    graphics = this.add.graphics();

    bounds = new Phaser.Geom.Rectangle(0, 0, 1600, 1200);
    rect1 = new Phaser.Geom.Rectangle(200, 200, 600, 100);
    rect2 = new Phaser.Geom.Rectangle(1010, 800, 60, 300);
    circle1 = new Phaser.Geom.Circle(1200, 200, 160);
    circle2 = new Phaser.Geom.Circle(400, 900, 80);
    triangle1 = new Phaser.Geom.Triangle.BuildEquilateral(800, 500, 200);

    drawScene();

    this.input.on('pointermove', function (pointer) {

        var p = this.cameras.main.getWorldPoint(pointer.x, pointer.y);

        px = p.x;
        py = p.y;

        hitShape = null;

        if (rect1.contains(px, py))
        {
            hitShape = rect1;
        }
        else if (rect2.contains(px, py))
        {
            hitShape = rect2;
        }
        else if (circle1.contains(px, py))
        {
            hitShape = circle1;
        }
        else if (circle2.contains(px, py))
        {
            hitShape = circle2;
        }
        else if (triangle1.contains(px, py))
        {
            hitShape = triangle1;
        }

        drawScene();

    }, this);

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

    controls = (Phaser.Cameras.Controls.Smoothed) ? new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig) : new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

    this.input.keyboard.on('keydown_Z', function (event) {

        this.cameras.main.rotation += 0.01;

    }, this);

    this.input.keyboard.on('keydown_X', function (event) {

        this.cameras.main.rotation -= 0.01;

    }, this);

    var cam = this.cameras.main;

    gui = new dat.GUI();

    var p1 = gui.addFolder('Pointer');
    p1.add(this.input, 'x').listen();
    p1.add(this.input, 'y').listen();
    p1.open();

    var help = {
        line1: 'Cursors to move',
        line2: 'Q & E to zoom',
        line3: 'Z & X to rotate',
    }

    var f1 = gui.addFolder('Camera');
    f1.add(cam, 'x').listen();
    f1.add(cam, 'y').listen();
    f1.add(cam, 'scrollX').listen();
    f1.add(cam, 'scrollY').listen();
    f1.add(cam, 'rotation').min(0).step(0.01).listen();
    f1.add(cam, 'zoom', 0.1, 2).step(0.1).listen();
    f1.add(help, 'line1');
    f1.add(help, 'line2');
    f1.add(help, 'line3');
    f1.open();
}

function update (time, delta)
{
    controls.update(delta);
}

function drawScene ()
{
    graphics.clear();

    //  camera marker
    graphics.lineStyle(1, 0x00ff00);
    graphics.strokeRectShape(bounds);
    graphics.lineBetween(0, 0, 1600, 1200);
    graphics.lineBetween(1600, 0, 0, 1200);

    //  shapes

    if (hitShape === rect1)
    {
        graphics.fillStyle(0xff0000);
        graphics.fillRectShape(rect1);
    }
    else
    {
        graphics.fillStyle(0xffff00);
        graphics.fillRectShape(rect1);
    }

    if (hitShape === rect2)
    {
        graphics.fillStyle(0xff0000);
        graphics.fillRectShape(rect2);
    }
    else
    {
        graphics.fillStyle(0xffff00);
        graphics.fillRectShape(rect2);
    }

    if (hitShape === circle1)
    {
        graphics.fillStyle(0xff0000);
        graphics.fillCircleShape(circle1);
    }
    else
    {
        graphics.fillStyle(0xffff00);
        graphics.fillCircleShape(circle1);
    }

    if (hitShape === circle2)
    {
        graphics.fillStyle(0xff0000);
        graphics.fillCircleShape(circle2);
    }
    else
    {
        graphics.fillStyle(0xffff00);
        graphics.fillCircleShape(circle2);
    }

    if (hitShape === triangle1)
    {
        graphics.fillStyle(0xff0000);
        graphics.fillTriangleShape(triangle1);
    }
    else
    {
        graphics.fillStyle(0xffff00);
        graphics.fillTriangleShape(triangle1);
    }
}
