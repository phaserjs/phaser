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
var seedRect;
var rectangles = [];

function create ()
{
    graphics = this.add.graphics({ lineStyle: { color: 0x0000aa }, fillStyle: { color: 0x0000aa } });

    seedRect = new Phaser.Geom.Rectangle(400, 300, 30, 30);

    this.input.on('pointermove', function (pointer) {

        Phaser.Geom.Rectangle.CenterOn(seedRect, pointer.x, pointer.y);

    });
}

function update ()
{
    var clone = Phaser.Geom.Rectangle.Clone(seedRect);

    rectangles.push(clone);

    graphics.clear();

    for(var i = 0; i < rectangles.length; i++)
    {
        var rect = rectangles[i];

        Phaser.Geom.Rectangle.Inflate(rect, rect.width * 0.05, rect.height * 0.05);

        if(rect.width > 1600)
        {
            rectangles.splice(i--, 1);
        }
        else
        {
            graphics.strokeRectShape(rect);
        }
    }
}