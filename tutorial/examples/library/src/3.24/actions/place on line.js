var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ball', 'assets/sprites/shinyball.png');
}

function create ()
{
    var line = new Phaser.Geom.Line(100, 200, 600, 400);

    var group = this.add.group({ key: 'ball', frameQuantity: 32 });

    Phaser.Actions.PlaceOnLine(group.getChildren(), line);
}
