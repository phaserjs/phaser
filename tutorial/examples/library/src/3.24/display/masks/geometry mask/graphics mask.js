var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        create: create,
        update: update
    }
};

var graphics;
var r = 0;

var game = new Phaser.Game(config);

function create ()
{
    graphics = this.add.graphics();

    var shape = this.make.graphics();

    //  Create a hash shape Graphics object
    shape.fillStyle(0xffffff);

    //  You have to begin a path for a Geometry mask to work
    shape.beginPath();

    shape.fillRect(50, 0, 50, 300);
    shape.fillRect(175, 0, 50, 300);
    shape.fillRect(0, 75, 275, 50);
    shape.fillRect(0, 200, 275, 50);

    var mask = shape.createGeometryMask();

    graphics.setMask(mask);

    this.input.on('pointermove', function (pointer) {

        shape.x = pointer.x - 140;
        shape.y = pointer.y - 140;

    });
}

function update ()
{
    r += 0.02;

    graphics.clear();

    //  From back to front :)

    drawLogo(0x650a05, -380, -100, 0.76);
    drawLogo(0xa00d05, -380, -100, 0.78);
    drawLogo(0xcd1106, -380, -100, 0.80);
    drawLogo(0xf53719, -380, -100, 0.82);
    drawLogo(0xf25520, -380, -100, 0.84);
    drawLogo(0xf26f21, -380, -100, 0.86);
    drawLogo(0xf49214, -380, -100, 0.88);
    drawLogo(0xf6a90a, -380, -100, 0.90);
    drawLogo(0xfad400, -380, -100, 0.92);
    drawLogo(0xfef700, -380, -100, 0.94);
    drawLogo(0xffff45, -380, -100, 0.96);
    drawLogo(0xffffc4, -380, -100, 0.98);
    drawLogo(0xffffff, -380, -100, 1.00);
}

function drawLogo (color, x, y, scale)
{
    var thickness = 12;
    var alpha = 1;

    graphics.lineStyle(thickness, color, alpha);

    var w = 100;
    var h = 200;
    var h2 = 100;
    var top = y + 0;
    var mid = y + 100;
    var bot = y + 200;
    var s = 20;

    graphics.save();
    graphics.translate(400, 300);
    graphics.scale(scale, scale);
    graphics.rotate(r);

    graphics.beginPath();

    //  P

    graphics.moveTo(x, top);
    graphics.lineTo(x + w, top);
    graphics.lineTo(x + w, mid);
    graphics.lineTo(x, mid);
    graphics.lineTo(x, bot);

    //  H

    x += w + s;

    graphics.moveTo(x, top);
    graphics.lineTo(x, bot);
    graphics.moveTo(x, mid);
    graphics.lineTo(x + w, mid);
    graphics.moveTo(x + w, top);
    graphics.lineTo(x + w, bot);

    //  A

    x += w + s;

    graphics.moveTo(x, bot);
    graphics.lineTo(x + (w * 0.75), top);
    graphics.lineTo(x + (w * 0.75) + (w * 0.75), bot);

    //  S

    x += ((w * 0.75) * 2) + s;

    graphics.moveTo(x + w, top);
    graphics.lineTo(x, top);
    graphics.lineTo(x, mid);
    graphics.lineTo(x + w, mid);
    graphics.lineTo(x + w, bot);
    graphics.lineTo(x, bot);

    //  E

    x += w + s;

    graphics.moveTo(x + w, top);
    graphics.lineTo(x, top);
    graphics.lineTo(x, bot);
    graphics.lineTo(x + w, bot);
    graphics.moveTo(x, mid);
    graphics.lineTo(x + w, mid);

    //  R

    x += w + s;

    graphics.moveTo(x, top);
    graphics.lineTo(x + w, top);
    graphics.lineTo(x + w, mid);
    graphics.lineTo(x, mid);
    graphics.lineTo(x, bot);
    graphics.moveTo(x, mid);
    graphics.lineTo(x + w, bot);

    graphics.strokePath();

    graphics.restore();
}
