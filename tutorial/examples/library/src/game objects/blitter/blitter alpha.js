class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('atari', 'assets/sprites/atari130xe.png');
    }

    create ()
    {
        const blitter = this.add.blitter(0, 0, 'atari');

        //  Change the alpha of each Bob as its created

        blitter.create(0, 0).setAlpha(1);

        blitter.create(200, 50).setAlpha(0.8);

        blitter.create(400, 100).setAlpha(0.5);

        blitter.create(600, 150).setAlpha(0.2);
    }
}

const config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
