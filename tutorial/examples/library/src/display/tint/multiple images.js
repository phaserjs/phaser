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
        this.add.image(300, 300, 'pixel').setTint(0xff0000);
        this.add.image(400, 300, 'pixel').setTint(0x00ff00);
        this.add.image(500, 300, 'pixel').setTint(0x0000ff);
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
