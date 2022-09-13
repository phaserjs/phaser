var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('grid', 'assets/pics/debug-grid-1920x1920.png');
    this.load.image('atari', 'assets/sprites/atari130xe.png');
}

function create ()
{
    this.add.image(0, 0, 'grid').setOrigin(0);

    //  Images are positioned at x,y based on the center of the image

    var x = 320;
    var y = 100;

    this.add.image(x, y, 'atari');

    //  You can also use the x and y properties:

    var image2 = this.add.image(0, 0, 'atari');

    image2.x = 640;
    image2.y = 200;

    //  Or the setPosition method, which allows for chaining:

    this.add.image(0, 0, 'atari').setPosition(320, 320);
}
