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

    var ellipse = new Phaser.Geom.Ellipse(400, 300, 250, 150);

    var text = this.add.text(400, 50, '');

    this.input.on('pointermove', function (pointer) {

        ellipse.setSize(pointer.x, pointer.y);

        redraw();

    });

    redraw();

    function redraw()
    {
        graphics.clear();

        var circumference = Phaser.Geom.Ellipse.Circumference(ellipse);

        // calculate side size for a square with the same circumference
        var squareSide = circumference / 4;

        graphics.lineStyle(2, 0x0000aa);
        graphics.strokeRect(400 - squareSide / 2, 300 - squareSide / 2, squareSide, squareSide);

        // calculate radius for a circle with the same circumference
        var circleRadius = circumference / (2 * Math.PI);

        graphics.lineStyle(2, 0x00aa00);
        graphics.strokeCircle(400, 300, circleRadius);

        graphics.lineStyle(2, 0x00aaaa);

        graphics.strokeEllipseShape(ellipse);

        text.setText("Ellipse Circumference: " + circumference);
    }
}