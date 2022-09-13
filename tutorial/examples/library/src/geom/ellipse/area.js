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
    var graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00aaaa }, fillStyle: { color: 0x0000aa } });

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

        var area = Phaser.Geom.Ellipse.Area(ellipse);

        var squareSide = Math.sqrt(area);

        graphics.fillRect(0, 0, squareSide, squareSide);

        graphics.strokeEllipseShape(ellipse);

        text.setText("Ellipse Area: " + area);

    }
}