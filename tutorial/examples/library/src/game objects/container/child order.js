var config = {
    type: Phaser.AUTO,
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
    this.load.image('block', 'assets/sprites/block.png');
}

function create ()
{
    var image1 = this.add.image(100, 90, 'block');
    var image2 = this.add.image(150, 90, 'block');
    var image3 = this.add.image(200, 90, 'block');
    var image4 = this.add.image(250, 90, 'block');

    container = this.add.container(300, 300, [ image1, image2, image3, image4 ]);

    container.bringToTop(image2);
}
