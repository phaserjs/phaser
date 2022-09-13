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
    var graphics = this.add.graphics({ fillStyle: { color: 0x00ff00, alpha: 0.1 } });

    var circles = [];

    for(var x = 0; x < 8; x++)
    {
        circles[x] = [];
        for(var y = 0; y < 6; y++)
        {
            circles[x][y] = new Phaser.Geom.Circle(50 + x * 100, 50 + y * 100, 50);
        }
    }

    var bigCircle = new Phaser.Geom.Circle(400, 300, 250);

    this.input.on('pointerdown', function (pointer) {
        var x = Math.floor(pointer.x / 100);
        var y = Math.floor(pointer.y / 100);

        Phaser.Geom.Circle.CopyFrom(bigCircle, circles[x][y]);

        redraw();
    });

    redraw();

    function redraw ()
    {
        graphics.clear();

        for(var x = 0; x < 8; x++)
        {
            for(var y = 0; y < 6; y++)
            {
                graphics.fillCircleShape(circles[x][y]);
            }
        }
    }
}
