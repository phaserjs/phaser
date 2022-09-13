var config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var image0;
var image1;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('image0', 'assets/pics/ra-einstein.png');
    this.load.image('image1', 'assets/sprites/mushroom2.png');
}

function create ()
{
    image0 = this.add.tileSprite(400, 300, 500.5, 500, 'image0');
    image1 = this.add.tileSprite(400, 300, 150, 150, 'image1');

    // image0.flipX = true;
    // image1.flipY = true;
}
