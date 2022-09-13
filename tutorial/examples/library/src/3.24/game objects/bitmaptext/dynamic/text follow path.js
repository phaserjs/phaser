var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var t = 0;
var path;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.bitmapFont('desyrel', 'assets/fonts/bitmap/desyrel.png', 'assets/fonts/bitmap/desyrel.xml');
}

function create ()
{
    path = new Phaser.Curves.Path(1500, 500);

    path.lineTo(700, 500);
    path.splineTo([ 745, 256, 550, 145, 300, 250, 260, 450, 50, 500 ]);
    path.lineTo(-100, 500);

    var text = this.add.dynamicBitmapText(0, 0, 'desyrel', 'Phaser 3', 64);

    text.setDisplayCallback(positionOnPath);

    var graphics = this.add.graphics();

    graphics.lineStyle(1, 0xffffff, 1);

    path.draw(graphics, 128);
}

function update()
{
    t += 0.001;

    if (t >= (1 - 0.24))
    {
        t = 0;
    }
}

//  data = { color: color, index: index, charCode: charCode, x: x, y: y, scaleX: scaleX, scaleY: scaleY }
function positionOnPath (data)
{
    var pathVector = path.getPoint(t + ((6 - data.index) * 0.04));

    if (pathVector)
    {
        data.x = pathVector.x;
        data.y = pathVector.y;
    }

    return data;
}
