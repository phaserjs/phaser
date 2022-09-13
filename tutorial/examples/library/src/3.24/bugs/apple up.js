var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 400,
    height: 300,
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
    var image = this.add.image(200, 150, 'block').setInteractive();

    image.on('pointerdown', function () {

        image.setTint(0xff0000);

    });

    image.on('pointerup', function () {

        image.setTint(0x00ff00);

    });
}
