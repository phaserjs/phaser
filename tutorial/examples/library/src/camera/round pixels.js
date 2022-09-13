class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('grid', 'assets/sprites/128x128-v2.png');
    }

    create ()
    {
        this.add.image(400.8, 300.3, 'grid').setScale(1.9);

        this.cameras.main.setRoundPixels(true);
        this.cameras.main.setZoom(1.3);
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    pixelArt: true,
    scene: [ Example ]
}

const game = new Phaser.Game(config);
