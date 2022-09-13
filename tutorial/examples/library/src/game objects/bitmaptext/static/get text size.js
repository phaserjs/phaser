class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.bitmapFont('atari', 'assets/fonts/bitmap/atari-smooth.png', 'assets/fonts/bitmap/atari-smooth.xml');
        this.load.bitmapFont('gothic', 'assets/fonts/bitmap/gothic.png', 'assets/fonts/bitmap/gothic.xml');
        this.load.bitmapFont('hyper', 'assets/fonts/bitmap/hyperdrive.png', 'assets/fonts/bitmap/hyperdrive.xml');
    }

    create ()
    {
        this.graphics = this.add.graphics({ x: 0, y: 0, fillStyle: { color: 0xff00ff, alpha: 1 } });

        const text1 = this.add.bitmapText(0, 0, 'atari', 'Welcome!', 70);
        const text2 = this.add.bitmapText(0, 160, 'gothic', 'Welcome!', 40);
        const text3 = this.add.bitmapText(0, 300, 'hyper', 'Terminator 2', 128);

        this.bounds1 = text1.getTextBounds(true);
        this.bounds2 = text2.getTextBounds(true);
        this.bounds3 = text3.getTextBounds(true);
    }

    update ()
    {
        this.graphics.clear();

        this.graphics.fillRect(this.bounds1.global.x, this.bounds1.global.y, this.bounds1.global.width, this.bounds1.global.height);
        this.graphics.fillRect(this.bounds2.global.x, this.bounds2.global.y, this.bounds2.global.width, this.bounds2.global.height);
        this.graphics.fillRect(this.bounds3.global.x, this.bounds3.global.y, this.bounds3.global.width, this.bounds3.global.height);
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
