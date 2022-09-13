var config = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    var graphics = this.add.graphics();

    var rect = new Phaser.Geom.Rectangle(325, 250, 150, 100);
    var triangle = Phaser.Geom.Triangle.BuildEquilateral(200, 50, 200);
    var circle = new Phaser.Geom.Circle(600, 130, 80);
    var ellipse = new Phaser.Geom.Ellipse(200, 450, 150, 90);
    var line = new Phaser.Geom.Line(550, 400, 650, 550);

    var shapes = [triangle, circle, ellipse, line];

    this.input.on('pointermove', function (pointer) {

        Phaser.Geom.Rectangle.CenterOn(rect, pointer.x, pointer.y);

        redraw();
    });

    redraw();

    function redraw()
    {
        graphics.clear();

        graphics.lineStyle(2, 0xaaaa00);

        graphics.strokeTriangleShape(triangle);
        graphics.strokeCircleShape(circle);
        graphics.strokeEllipseShape(ellipse);
        graphics.strokeLineShape(line);

        graphics.lineStyle(2, 0x0000aa);

        for(var i = 0; i < shapes.length; i++)
        {
            var shape = shapes[i];
            if(Phaser.Geom.Intersects.RectangleToValues(rect, shape.left, shape.right, shape.top, shape.bottom))
            {
                graphics.lineStyle(2, 0xaa0000);
                break;
            }
        }

        graphics.strokeRectShape(rect);
    }
}
