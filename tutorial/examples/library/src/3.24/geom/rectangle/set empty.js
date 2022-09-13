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
    var graphics = this.add.graphics({ fillStyle: { color: 0x0000ff }, lineStyle: { color: 0x0000aa } });

    var rectangles = [];

    for(var x = 0; x < 10; x++)
    {
        rectangles[x] = [];
        for(var y = 0; y < 10; y++)
        {
            rectangles[x][y] = new Phaser.Geom.Rectangle(x * 80, y * 60, 80, 60);
        }
    }

    this.input.on('pointerdown', function (pointer) {
        var x = Math.floor(pointer.x / 80);
        var y = Math.floor(pointer.y / 60);

        rectangles[x][y].setEmpty();

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
                graphics.fillRectShape(rectangles[x][y]);
                graphics.strokeRectShape(rectangles[x][y]);
            }
        }
    }
}
