var config = {
    type: Phaser.WEBGL,
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
    this.load.image('pixel', 'assets/sprites/16x16.png');
}

function create ()
{
    //  Red raster
    this.add.image(400, 150-32, 'pixel').setDisplaySize(800, 64).setTintFill(0x000000, 0x000000, 0xff0000, 0xff0000);
    this.add.image(400, 150+32, 'pixel').setDisplaySize(800, 64).setTintFill(0xff0000, 0xff0000, 0x000000, 0x000000);

    //  Green raster
    this.add.image(400, 300-32, 'pixel').setDisplaySize(800, 64).setTintFill(0x000000, 0x000000, 0x00ff00, 0x00ff00);
    this.add.image(400, 300+32, 'pixel').setDisplaySize(800, 64).setTintFill(0x00ff00, 0x00ff00, 0x000000, 0x000000);

    //  Blue raster
    this.add.image(400, 450-32, 'pixel').setDisplaySize(800, 64).setTintFill(0x000000, 0x000000, 0x0000ff, 0x0000ff);
    this.add.image(400, 450+32, 'pixel').setDisplaySize(800, 64).setTintFill(0x0000ff, 0x0000ff, 0x000000, 0x000000);
}
