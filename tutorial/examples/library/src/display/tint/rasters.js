class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('pixel', 'assets/sprites/16x16.png');
    }

    create ()
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
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
