var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var image1;
var image2;
var image3;
var image4;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('grid', 'assets/pics/debug-grid-1920x1920.png');
    this.load.image('atari', 'assets/sprites/atari130xe.png');
}

function create ()
{
    this.add.image(0, 0, 'grid').setOrigin(0);

    image1 = this.add.image(200, 320, 'atari'); // default origin is 0.5 = the center
    image2 = this.add.image(400, 320, 'atari').setOrigin(0);
    image3 = this.add.image(600, 320, 'atari').setOrigin(0.25, 0.75);
    image4 = this.add.image(800, 320, 'atari').setOrigin(1);
}

function update ()
{
    image1.rotation += 0.01;
    image2.rotation += 0.01;
    image3.rotation += 0.01;
    image4.rotation += 0.01;
}
