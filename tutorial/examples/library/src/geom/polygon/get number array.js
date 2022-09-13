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
    var graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xaa6622 } });

    var points = [
        new Phaser.Geom.Point(420, 280),
        new Phaser.Geom.Point(450, 250),
        new Phaser.Geom.Point(470, 300)
    ];

    var polygon = new Phaser.Geom.Polygon(points);

    this.input.on('pointermove', function (pointer) {

        Phaser.Geom.Point.CopyFrom(pointer, points[points.length - 1]);

        polygon.setTo(points);

        redraw();
    });

    this.input.on('pointerdown', function (pointer) {

        points.push(Phaser.Geom.Point.Clone(points[points.length - 1]));

    });

    redraw();

    function redraw()
    {
        graphics.clear();

        graphics.strokePoints(polygon.points, true);

        graphics.lineStyle(2, 0x0000aa);

        var numbers = Phaser.Geom.Polygon.GetNumberArray(polygon);

        graphics.beginPath();

        // draw as if x was y and y was x
        graphics.moveTo(numbers[1], numbers[0]);

        for(var i = 0; i < numbers.length; i += 2)
        {
            graphics.lineTo(numbers[i + 1], numbers[i]);
        }

        graphics.lineTo(numbers[1], numbers[0]);

        graphics.closePath();
        graphics.strokePath();
    }
}
