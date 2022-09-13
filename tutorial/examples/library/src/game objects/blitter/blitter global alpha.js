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

        blitter.setAlpha(0.5);

        blitter.create(0, 0);

        blitter.create(200, 50).setAlpha(0.5);

        blitter.create(400, 100);

        blitter.create(600, 150);
    }

    update ()
    {

    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
