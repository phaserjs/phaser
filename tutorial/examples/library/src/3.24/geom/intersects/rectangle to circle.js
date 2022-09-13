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

var moveShape;
var circle;
var rectangle;
var graphics;

function create ()
{
    graphics = this.add.graphics();

    rectangle = new Phaser.Geom.Rectangle(200, 150, 300, 200);
    circle = new Phaser.Geom.Circle(300, 400, 60);

    moveShape = circle;

    this.input.on('pointerup', function (event) {

        if (moveShape === circle)
        {
            moveShape = rectangle;
        }
        else
        {
            moveShape = circle;
        }

    });

    this.input.on('pointermove', function (pointer) {

        moveShape.x = pointer.x;
        moveShape.y = pointer.y;

    });
}

function update ()
{
    graphics.clear();

    if (Phaser.Geom.Intersects.CircleToRectangle(circle, rectangle))
    {
        graphics.lineStyle(2, 0xff0000);
    }
    else
    {
        graphics.lineStyle(2, 0xffff00);
    }

    graphics.strokeRectShape(rectangle);
    graphics.strokeCircleShape(circle);
}
