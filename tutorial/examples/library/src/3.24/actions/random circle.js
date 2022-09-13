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
    this.load.image('orb', 'assets/sprites/orb-blue.png');
}

function create ()
{
    //  Create 300 sprites (they all start life at 0x0)
    var group = this.add.group({ key: 'orb', frameQuantity: 300 });

    var circle = new Phaser.Geom.Circle(400, 300, 130);

    //  Randomly position the sprites within the circle
    Phaser.Actions.RandomCircle(group.getChildren(), circle);
}
