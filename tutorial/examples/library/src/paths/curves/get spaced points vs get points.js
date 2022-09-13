var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    graphics = this.add.graphics();

    var path = new Phaser.Curves.Path(100, 100);

    path.lineTo(500, 200);
    path.lineTo(200, 300);
    path.lineTo(400, 500);

    var spacedPoints = path.getSpacedPoints(4);
    var points = path.getPoints(4);

    var showPoints = true;

    var text = this.add.text(10, 10);

    var togglePoints = () => {

        graphics.clear();

        graphics.lineStyle(1, 0xffffff, 1);

        path.draw(graphics, 64);

        if (showPoints)
        {
            graphics.fillStyle(0xffff00, 1);

            for (var i = 0; i < points.length; i++)
            {
                graphics.fillCircle(points[i].x, points[i].y, 4);
            }

            text.setText('Click to toggle\nType: Path.getPoints(4)');
        }
        else
        {
            graphics.fillStyle(0x00ff00, 1);

            for (var i = 0; i < spacedPoints.length; i++)
            {
                graphics.fillCircle(spacedPoints[i].x, spacedPoints[i].y, 4);
            }

            text.setText('Click to toggle\nType: Path.getSpacedPoints(4)');
        }

        showPoints = !showPoints;

    };

    this.input.on('pointerdown', togglePoints);

    togglePoints();
}
