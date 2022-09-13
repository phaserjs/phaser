var config = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('chunk', 'assets/sprites/chunk.png');
}

function create ()
{
    var rect = new Phaser.Geom.Rectangle(100, 100, 300, 180);

    //  Each point is 10px apart
    // var points = Phaser.Geom.Rectangle.MarchingAnts(rect, 10);

    //  In this version we get the points based on passing in a quantity of 64 points only
    var points = Phaser.Geom.Rectangle.MarchingAnts(rect, false, 64);

    for (var i = 0; i < points.length; i++)
    {
        this.add.image(points[i].x, points[i].y, 'chunk');
    }
}
