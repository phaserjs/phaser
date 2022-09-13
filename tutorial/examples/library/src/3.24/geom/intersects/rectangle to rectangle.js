var config = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var graphics;
var rect;
var pointerRect;
var a = 0;

function create ()
{
    graphics = this.add.graphics({ fillStyle: { color: 0xaa0000} });

    rect = new Phaser.Geom.Rectangle(0, 0, 100, 150);
    pointerRect = new Phaser.Geom.Rectangle(450, 350, 150, 100);

    this.input.on('pointermove', function (pointer) {

        Phaser.Geom.Rectangle.CenterOn(pointerRect, pointer.x, pointer.y);

    });
}

function update ()
{
    a += 0.015;

    if (a > Math.PI * 4)
    {
        a -= Math.PI * 4;
    }

    var x = 400 - Math.cos(a / 2) * 400;
    var y = 300 - Math.sin(a * 2) * 300;

    Phaser.Geom.Rectangle.CenterOn(rect, x, y);

    graphics.clear();
    graphics.fillRectShape(rect);

    if (Phaser.Geom.Intersects.RectangleToRectangle(rect, pointerRect))
    {
        graphics.lineStyle(4, 0xaa0000);
    }
    else
    {
        graphics.lineStyle(4, 0x00aa00);
    }

    graphics.strokeRectShape(pointerRect);
}
