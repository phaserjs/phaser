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

var rect;
var rectangles;
var graphics;
var a = 0;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x0000aa }, fillStyle: { color: 0xaa0000 }});

    rect = new Phaser.Geom.Rectangle(0, 0, 30, 30);

    rectangles = [];

    for(var x = 0; x < 10; x++)
    {
        for(var y = 0; y < 10; y++)
        {
            rectangles.push(new Phaser.Geom.Rectangle(x * 80, y * 60, 80, 60));
        }
    }
}

function update ()
{
    a += 0.005;

    if (a > Math.PI * 2)
    {
        a -= Math.PI * 2;
    }

    rect.x = 370 - Math.cos(a) * 370;
    rect.y = 270 - Math.sin(a * 2) * 270;

    graphics.clear();
    graphics.fillRectShape(rect);

    // stroke blue all rectangles NOT overlapping rect
    graphics.lineStyle(1, 0x0000aa);

    for(var i = 0; i < rectangles.length; i++)
    {
        if(!Phaser.Geom.Rectangle.Overlaps(rectangles[i], rect))
        {
            graphics.strokeRectShape(rectangles[i]);
        }
    }

    // stroke red all rectangles that DO overlap rect
    graphics.lineStyle(2, 0xaa0000);

    for(var i = 0; i < rectangles.length; i++)
    {
        if(Phaser.Geom.Rectangle.Overlaps(rectangles[i], rect))
        {
            graphics.strokeRectShape(rectangles[i]);
        }
    }
}