class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
        this.value = 0;
    }

    preload ()
    {
        this.load.image('knighthawks', 'assets/fonts/retro/knight3.png');
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
        this.dynamic.text = 'PHASER 3\nVER ' + this.value.toFixed(2);
        this.value += 0.01;
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    pixelArt: true,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
