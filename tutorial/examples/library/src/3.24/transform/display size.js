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
    this.load.image('frame', 'assets/pics/scrollframe.png');
    this.load.image('pic', 'assets/pics/cougar-face-of-nature.png');
}

function create ()
{
    this.add.image(0, 0, 'frame').setOrigin(0);

    //  setDisplaySize will adjust the scale of an image to make it fit the given pixel dimensions:

    this.add.image(32, 32, 'pic').setOrigin(0).setDisplaySize(352, 240);
}
