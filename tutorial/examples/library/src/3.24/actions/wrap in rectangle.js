var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var group;
var rect;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ball', 'assets/sprites/shinyball.png');
}

function create ()
{
    rect = new Phaser.Geom.Rectangle(100, 100, 256, 256);

    group = this.add.group({ key: 'ball', frameQuantity: 32 });

    Phaser.Actions.RandomRectangle(group.getChildren(), rect);
}

function update ()
{
    var children = group.getChildren();

    Phaser.Actions.IncXY(children, 1, 1);
    Phaser.Actions.WrapInRectangle(children, rect);
}
