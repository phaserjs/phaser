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
var step = 0.5;
var point;
var rect;

function create ()
{
    graphics = this.add.graphics({ fillStyle: { color: 0x0000aa } });

    rect = new Phaser.Geom.Rectangle(395, 295, 10, 10);

    point = new Phaser.Geom.Point(7, 7);
}

function update ()
{
    if (rect.y < 600)
    {
        graphics.fillRectShape(rect);

        Phaser.Geom.Rectangle.OffsetPoint(rect, point);

        Phaser.Math.Rotate(point, step);

        step  *= 0.995;
    }
}
