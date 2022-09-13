var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#efefef',
    parent: 'phaser-example',
    scene: {
        create: create,
        update: update
    }
};

var path;
var curve;

var p0;
var p1;
var p2;
var p3;

var line1;
var line2;
var line3;

var line4;
var line5;

var graphics;
var drawGraphics;

var game = new Phaser.Game(config);

function create ()
{
    //  Create a Canvas based texture to draw on
    this.textures.createCanvas('curve', 800, 600);

    this.add.image(0, 0, 'curve').setOrigin(0);

    drawGraphics = this.add.graphics();

    graphics = this.add.graphics();

    path = { t: 0, vec: new Phaser.Math.Vector2() };

    p0 = new Phaser.Math.Vector2(100, 500);
    p1 = new Phaser.Math.Vector2(50, 100);
    p2 = new Phaser.Math.Vector2(600, 100);
    p3 = new Phaser.Math.Vector2(700, 550);

    curve = new Phaser.Curves.CubicBezier(p0, p1, p2, p3);

    line1 = new Phaser.Curves.Line(p0, p1);
    line2 = new Phaser.Curves.Line(p1, p2);
    line3 = new Phaser.Curves.Line(p2, p3);

    line4 = new Phaser.Curves.Line(new Phaser.Math.Vector2(), new Phaser.Math.Vector2());
    line5 = new Phaser.Curves.Line(new Phaser.Math.Vector2(), new Phaser.Math.Vector2());

    this.tweens.add({
        targets: path,
        t: 1,
        ease: 'Sine.easeInOut',
        duration: 8000,
        yoyo: true,
        repeat: -1
    });
}

function update ()
{
    graphics.clear();

    //  Debug lines

    graphics.lineStyle(6, 0xababab, 1);
    graphics.lineBetween(p0.x, p0.y, p1.x, p1.y);
    graphics.lineBetween(p1.x, p1.y, p2.x, p2.y);
    graphics.lineBetween(p2.x, p2.y, p3.x, p3.y);

    //  Between p0 and p1

    graphics.lineStyle(2, 0x00ff00, 1);
    graphics.fillStyle(0x00ff00, 1);

    var t1 = line1.getPoint(path.t);
    var t2 = line2.getPoint(path.t);
    var t3 = line3.getPoint(path.t);

    graphics.fillCircle(t1.x, t1.y, 6);
    graphics.fillCircle(t2.x, t2.y, 6);
    graphics.fillCircle(t3.x, t3.y, 6);

    graphics.lineBetween(t1.x, t1.y, t2.x, t2.y);
    graphics.lineBetween(t2.x, t2.y, t3.x, t3.y);

    graphics.lineStyle(2, 0x0000ff, 1);
    graphics.fillStyle(0x0000ff, 1);

    line4.p0.copy(t1);
    line4.p1.copy(t2);

    line5.p0.copy(t2);
    line5.p1.copy(t3);

    var t4 = line4.getPoint(path.t);
    var t5 = line5.getPoint(path.t);

    graphics.lineBetween(t4.x, t4.y, t5.x, t5.y);
    graphics.fillCircle(t4.x, t4.y, 6);
    graphics.fillCircle(t5.x, t5.y, 6);

    //  Bezier

    curve.getPoint(path.t, path.vec);

    graphics.fillStyle(0xff0000, 1);
    graphics.fillCircle(path.vec.x, path.vec.y, 8);

    drawGraphics.clear();

    drawGraphics.fillStyle(0xff0000, 0.1);
    drawGraphics.fillCircle(path.vec.x, path.vec.y, 4);

    drawGraphics.generateTexture('curve', 800, 600);
}
