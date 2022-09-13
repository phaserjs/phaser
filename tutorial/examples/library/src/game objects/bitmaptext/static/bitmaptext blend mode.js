class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('z2', 'assets/pics/zero-two.png');
        this.load.bitmapFont('ice', 'assets/fonts/bitmap/iceicebaby.png', 'assets/fonts/bitmap/iceicebaby.xml');
    }

    create ()
    {
        this.add.image(400, 300, 'z2');

        const text = this.add.bitmapText(64, 200, 'ice', 'Zero Two', 32);

        text.setBlendMode(Phaser.BlendModes.ADD);

        this.tweens.add({
            targets: text,
            duration: 4000,
            scaleX: 4,
            ease: 'Quad.easeInOut',
            repeat: -1,
            yoyo: true
        });

        this.tweens.add({
            targets: text,
            duration: 3000,
            scaleY: 8,
            ease: 'Cubic.easeInOut',
            repeat: -1,
            yoyo: true
        });
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
