class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('knighthawks', 'assets/fonts/retro/knight3.png');
        this.value = 0;
    }

    create ()
    {
        var config = {
            image: 'knighthawks',
            width: 31,
            height: 25,
            chars: Phaser.GameObjects.RetroFont.TEXT_SET6,
            charsPerRow: 10,
            spacing: { x: 1, y: 1 }
        };

        this.cache.bitmapFont.add('knighthawks', Phaser.GameObjects.RetroFont.Parse(this, config));

        this.dynamic = this.add.bitmapText(0, 200, 'knighthawks', 'PHASER 3');

        this.dynamic.setScale(3);
    }

    update ()
    {
        this.dynamic.text = 'VER ' + this.value.toFixed(2);
        this.value += 0.01;
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    pixelArt: true,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
