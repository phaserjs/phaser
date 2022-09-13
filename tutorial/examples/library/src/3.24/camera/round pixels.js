var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    width: 800,
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
    this.load.image('grid', 'assets/sprites/128x128-v2.png');
}

function create ()
{
    this.add.image(400.8, 300.3, 'grid').setScale(1.9);

    this.cameras.main.setRoundPixels(true);
    this.cameras.main.setZoom(1.3);
}
