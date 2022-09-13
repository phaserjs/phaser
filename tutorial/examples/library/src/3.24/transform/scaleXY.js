var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 1024,
    height: 600,
    pixelArt: true,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('atari', 'assets/sprites/atari130xe.png');
}

function create ()
{
    //  setScale sets the x and y scale values
    this.add.image(100, 300, 'atari').setScale(0.5, 0.2);

    //  If you just provide one value then both x and y are set to it
    this.add.image(400, 300, 'atari').setScale(2);
    
    var image2 = this.add.image(800, 300, 'atari');

    //  You can also set the scale via the scaleX and scaleY properties:
    image2.scaleX = 0.5;
    image2.scaleY = 4.5;
}
