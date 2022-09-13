class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('knighthawks', 'assets/fonts/retro/knight3.png');
        this.load.image('rain', 'assets/pics/thalion-rain.png');
        this.load.image('contra', 'assets/pics/contra1.png');
    }

    create ()
    {
        this.add.image(0, 0, 'rain').setOrigin(0).setScale(4);

        const config = {
            image: 'knighthawks',
            width: 31,
            height: 25,
            chars: Phaser.GameObjects.RetroFont.TEXT_SET6,
            charsPerRow: 10,
            spacing: { x: 1, y: 1 }
        };

        this.cache.bitmapFont.add('knighthawks', Phaser.GameObjects.RetroFont.Parse(this, config));

        this.dynamic = this.add.dynamicBitmapText(0, 0, 'knighthawks', '               PHASER 3 IS IN THE HOUSE');

        this.dynamic.setScale(4);

        this.tweens.add({
            targets: this.dynamic,
            duration: 4000,
            y: 175*4,
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: true
        });

        this.add.image(1280, 800, 'contra').setOrigin(1).setScale(4);
    }

    update (time, delta)
    {
        this.dynamic.scrollX += 0.15 * delta;

        if (this.dynamic.scrollX > 1300)
        {
            this.dynamic.scrollX = 0;
        }
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    pixelArt: true,
    width: 1280,
    height: 800,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
