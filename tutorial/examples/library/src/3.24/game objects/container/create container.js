var config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    backgroundColor: '#010101',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('lemming', 'assets/sprites/lemming.png');
}

function create ()
{
    //  Create some images

    //  Positions are relative to the Container x/y
    var image0 = this.add.image(0, 0, 'lemming');
    var image1 = this.add.image(-100, -100, 'lemming');
    var image2 = this.add.image(100, -100, 'lemming');
    var image3 = this.add.image(100, 100, 'lemming');
    var image4 = this.add.image(-100, 100, 'lemming');

    container = this.add.container(400, 300, [ image0, image1, image2, image3, image4 ]);

    this.tweens.add({
        targets: container,
        angle: 360,
        duration: 6000,
        yoyo: true,
        repeat: -1
    });
}
