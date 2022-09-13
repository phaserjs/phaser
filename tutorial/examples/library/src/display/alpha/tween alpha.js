class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('turkey', 'assets/pics/turkey-1985086.jpg');
        this.load.image('face', 'assets/pics/bw-face.png');
    }

    create ()
    {
        const face = this.add.image(400, 300, 'face');

        const sea = this.add.image(400, 300, 'turkey').setAlpha(0);

        this.tweens.add({
            targets: sea,
            alphaTopLeft: { value: 1, duration: 5000, ease: 'Power1' },
            alphaBottomRight: { value: 1, duration: 10000, ease: 'Power1' },
            alphaBottomLeft: { value: 1, duration: 5000, ease: 'Power1', delay: 5000 },
            yoyo: true,
            loop: -1

        });
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
