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
    var graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xaaaa00 } });

    var triangle = new Phaser.Geom.Triangle(100, 100, 150, 500, 400, 300);

    var text = this.add.text(50, 50, '');

    this.input.on('pointermove', function (pointer) {

        triangle.x3 = pointer.x;
        triangle.y3 = pointer.y;

        redraw();
    });

    redraw();

    function redraw()
    {
        graphics.clear();

        graphics.strokeTriangleShape(triangle);

        text.setText("Perimeter : " + Phaser.Geom.Triangle.Perimeter(triangle));
    }
}
