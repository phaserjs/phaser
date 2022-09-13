var config = {
    type: Phaser.WEBGL,
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

var image0;
var image1;
var game = new Phaser.Game(config);
var iter = 0;

function preload ()
{
    this.load.image('image0', 'assets/pics/ra-einstein.png');
    this.load.image('image1', 'assets/sprites/mushroom2.png');
    this.load.image('bunny', 'assets/sprites/bunny.png');
    this.load.bitmapFont('desyrel', 'assets/fonts/bitmap/desyrel.png', 'assets/fonts/bitmap/desyrel.xml');
}

function create ()
{
    image0 = this.add.tileSprite(400, 300, 500, 500, 'image0');
    this.add.sprite(400, 300, 'bunny');
    image1 = this.add.tileSprite(400, 300, 150, 150, 'image1');
    this.add.bitmapText(0, 0, 'desyrel', 'Hello World');
}

function update ()
{
    image0.tilePositionX = Math.cos(iter) * 400;
    image0.tilePositionY = Math.sin(iter) * 400;
    image1.tilePositionX = Math.cos(-iter) * 400;
    image1.tilePositionY = Math.sin(-iter) * 400;
    iter += 0.01;
}