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
    //  setScale sets the x and y scale values (1 = no scale)
    this.add.image(100, 300, 'atari').setScale(1, 0.5);

    this.add.image(400, 300, 'atari').setScale(1, 2);
    
    var image2 = this.add.image(700, 300, 'atari');

    //  You can also set the scale via the scaleY property:
    image2.scaleY = 4.5;
}
