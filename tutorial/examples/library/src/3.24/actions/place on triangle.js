var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ball', 'assets/sprites/chunk.png');
}

function create ()
{
    // var triangle = new Phaser.Geom.Triangle.BuildEquilateral(400, 100, 380);
    var triangle = new Phaser.Geom.Triangle.BuildRight(200, 400, 300, 200);

    var group = this.add.group({ key: 'ball', frameQuantity: 64 });

    Phaser.Actions.PlaceOnTriangle(group.getChildren(), triangle);
}
