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
    var graphics = this.add.graphics({ fillStyle: { color: 0xaaaa00 } });

    var triangle = new Phaser.Geom.Triangle(0, 0, 0, 600, 400, 300);

    var text = this.add.text(400, 50, '');

    this.input.on('pointermove', function (pointer) {

        triangle.x3 = pointer.x;
        triangle.y3 = pointer.y;

        redraw();

    });

    redraw();

    function redraw()
    {
        graphics.clear();

        graphics.fillTriangleShape(triangle);

        var area = Phaser.Geom.Triangle.Area(triangle);

        text.setText("Triangle Area: " + area);
    }
}
