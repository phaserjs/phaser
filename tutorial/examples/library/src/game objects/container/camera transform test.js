
var overlaySceneConfig = {
    key: 'overlay',
    active: true,
    create: createOverlay,
    update: updateOverlay
};

var mainSceneConfig = {
    key: 'main',
    active: true,
    preload: preload,
    create: create
};

var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ mainSceneConfig, overlaySceneConfig ]
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('eye', 'assets/pics/lance-overdose-loader-eye.png');
    this.load.image('grid', 'assets/pics/debug-grid-1920x1920.png');
}

var cam1;
var sprite;
var result;

function create ()
{
    cam1 = this.cameras.main.setName('Camera 1');

    this.add.image(0, 0, 'grid').setOrigin(0).setAlpha(0.5);

    var container = this.add.container(200, 100);

    sprite = this.add.sprite(100, 100, 'eye').setInteractive();

    container.add(sprite);

    sprite.setScale(2, 1);
    container.setScale(2);
    sprite.setAngle(20);

    var text = this.add.text(10, 10, 'Click on sprite', { font: '16px Courier', fill: '#00ff00' });

    sprite.on('pointerdown', function () {
        this.input.enableDebug(sprite);
    }, this);

    var gui = new dat.GUI();

    var p1 = gui.addFolder('Pointer');
    p1.add(this.input, 'x').listen();
    p1.add(this.input, 'y').listen();
    p1.open();

    var c1 = gui.addFolder('Camera');
    c1.add(cam1, 'x').listen();
    c1.add(cam1, 'y').listen();
    c1.add(cam1, 'scrollX').listen();
    c1.add(cam1, 'scrollY').listen();
    c1.add(cam1, 'rotation').min(0).step(0.01).listen();
    c1.add(cam1, 'zoom', 0.1, 2).step(0.1).listen();
    c1.open();
}

var graphics;

function createOverlay ()
{
    graphics = this.add.graphics();
}

function updateOverlay ()
{
    graphics.clear();

    graphics.lineStyle(2, 0x00ff00, 1);

    if (result)
    {
        var tl = sprite.getTopLeft(null, true);
        var tr = sprite.getTopRight(null, true);
        var bl = sprite.getBottomLeft(null, true);
        var br = sprite.getBottomRight(null, true);

        // cam1.getWorldPoint(tl.x, tl.y, tl);
        // cam1.getWorldPoint(tr.x, tr.y, tr);
        // cam1.getWorldPoint(bl.x, bl.y, bl);
        // cam1.getWorldPoint(br.x, br.y, br);

        graphics.lineStyle(2, 0x00ff00, 1);
        graphics.lineBetween(tl.x, tl.y, tr.x, tr.y);
        graphics.lineBetween(tl.x, tl.y, bl.x, bl.y);
        graphics.lineBetween(tr.x, tr.y, br.x, br.y);
        graphics.lineBetween(bl.x, bl.y, br.x, br.y);

        graphics.fillStyle(0x00ff00, 1);
        graphics.fillRect(tl.x, tl.y, 6, 6);

        graphics.fillStyle(0xff0000, 1);
        graphics.fillRect(tr.x, tr.y, 6, 6);

        graphics.fillStyle(0xff00ff, 1);
        graphics.fillRect(bl.x, bl.y, 6, 6);

        graphics.fillStyle(0x0000ff, 1);
        graphics.fillRect(br.x, br.y, 6, 6);

    }
}
