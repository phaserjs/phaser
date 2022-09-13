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
    this.load.image('pic', 'assets/pics/cougar-face-of-nature.png');
}

function create ()
{
    //  Default non-flipped image
    this.add.image(250, 164, 'pic');

    //  Flipped via a call to setFlipX
    this.add.image(250, 464, 'pic').setFlipX(true);

    var image = this.add.image(650, 164, 'pic');

    //  Flipped via setting the flipX property
    image.flipX = true;

    var image2 = this.add.image(650, 464, 'pic');

    this.input.on('pointerdown', function () {

        //  Flipped via a call to toggleFlipX
        image2.toggleFlipX();

    });
}
