var config = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var graphics;
var pointerRect;
var rectangles;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { color: 0x0000aa }, fillStyle: { color: 0x0000aa, alpha: 0.5 } });

    pointerRect = new Phaser.Geom.Rectangle(0, 0, 80, 60);

    rectangles = [];

    for(var x = 0; x < 10; x++)
    {
        rectangles[x] = [];

        for(var y = 0; y < 10; y++)
        {
            rectangles[x][y] = new Phaser.Geom.Rectangle(x * 80, y * 60, 80, 60);
        }
    }

    this.input.on('pointermove', function (pointer) {
        var x = Math.floor(pointer.x / 80);
        var y = Math.floor(pointer.y / 60);

        pointerRect.setPosition(x * 80, y * 60);

        Phaser.Geom.Rectangle.CopyFrom(pointerRect, rectangles[x][y]);
    });
}

function update ()
{
    graphics.clear();

    graphics.fillRectShape(pointerRect);

    for(var x = 0; x < 10; x++)
    {
        for(var y = 0; y < 10; y++)
        {
            var rect = rectangles[x][y];

            if(rect.width > 10)
            {
                rect.width *= 0.95;
                rect.height *= 0.95;
            }

            graphics.strokeRectShape(rect);
        }
    }
}