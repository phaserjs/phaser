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
    var graphics = this.add.graphics({ fillStyle: { color: 0x00aaaa } });

    var ellipses = [];

    for(var x = 0; x < 10; x++)
    {
        ellipses[x] = [];
        for(var y = 0; y < 10; y++)
        {
            ellipses[x][y] = new Phaser.Geom.Ellipse(40 + x * 80, 30 + y * 60, 80, 60);
        }
    }

    this.input.on('pointerdown', function (pointer) {
        var x = Math.floor(pointer.x / 80);
        var y = Math.floor(pointer.y / 60);

        ellipses[x][y].setEmpty();

        redraw();
    });

    redraw();

    function redraw ()
    {
        graphics.clear();

        for(var x = 0; x < 10; x++)
        {
            for(var y = 0; y < 10; y++)
            {
                graphics.fillEllipseShape(ellipses[x][y]);
            }
        }
    }
}