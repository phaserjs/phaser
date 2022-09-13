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
var rect;
var shapes;

var game = new Phaser.Game(config);

function create ()
{
    graphics = this.add.graphics();

    shapes = new Array(15).fill(null).map(function (nul, i)
    {
        return new Phaser.Geom.Circle(Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 600), Phaser.Math.Between(25, 75));
    });

    rect = Phaser.Geom.Rectangle.Clone(this.cameras.main);
}

function update ()
{
    shapes.forEach(function (shape, i) {
        shape.x += (1 + 0.1 * i);
        shape.y += (1 + 0.1 * i);
    });

    Phaser.Actions.WrapInRectangle(shapes, rect, 72);

    draw();
}

function color (i)
{
    return 0x001100 * (i % 15) + 0x000033 * (i % 5);
}

function draw ()
{
    graphics.clear();

    shapes.forEach(function (shape, i) {
        graphics
        .fillStyle(color(i), 0.5)
        .fillCircleShape(shape);
    });
}
