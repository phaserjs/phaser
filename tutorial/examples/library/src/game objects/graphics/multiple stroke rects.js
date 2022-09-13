var config = {
    width: 800,
    height: 600,
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: {
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var start;
var hsv;
var graphics;
var size = 64 * 2;
var historyX = Array(size);
var historyY = Array(size);
var index = 0;

function create ()
{
    graphics = this.add.graphics();

    //  diamond shape from 400x300 =

    //  400 x 100 (top middle)
    //  100 x 300 (left)
    //  700 x 300 (right)
    //  400 x 500 (bottom)

    start = new Phaser.Geom.Point(400, 100);

    var top = new Phaser.Geom.Point(400, 100);
    var left = new Phaser.Geom.Point(100, 300);
    var right = new Phaser.Geom.Point(700, 300);
    var bottom = new Phaser.Geom.Point(400, 500);

    hsv = Phaser.Display.Color.HSVColorWheel();

    this.tweens.timeline({

        targets: start,
        loop: -1,
        duration: 2000,

        tweens: [
            { x: left.x, y: left.y, ease: 'Sine.easeOut' },
            { x: bottom.x, y: bottom.y, ease: 'Sine.easeInOut' },
            { x: right.x, y: right.y, ease: 'Sine.easeInOut' },
            { x: top.x, y: top.y, ease: 'Sine.easeIn' }
        ]

    });

    //  Fill the history array
    for (var i = 0; i < size; i++)
    {
        historyX[i] = start.x;
        historyY[i] = start.y;
    }
}

function update ()
{
    historyX[index] = start.x;
    historyY[index] = start.y;

    index++;

    if (index === size)
    {
        index = 0;
    }

    graphics.clear();

    for (var i = 0; i < 64; i++)
    {
        graphics.fillStyle(hsv[i * 2].color, 1);
        graphics.fillCircle(historyX[i * 2], historyY[i * 2], 64);
    }

}
