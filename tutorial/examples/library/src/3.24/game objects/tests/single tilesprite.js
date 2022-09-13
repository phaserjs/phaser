var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('mushroom', 'assets/sprites/mushroom-32x32.png');
}

function create ()
{
    var test = this.add.tileSprite(400, 300, 32*14, 32*8, 'mushroom');

    test.setAngle(20).setScale(0.5);

    console.log(test);
}
