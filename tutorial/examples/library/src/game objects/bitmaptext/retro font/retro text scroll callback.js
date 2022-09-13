let s = {
    y: -32
};

class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('knighthawks', 'assets/fonts/retro/knight3.png');
        this.load.image('1984', 'assets/pics/1984-nocooper-space.png');
        this.load.image('contra', 'assets/pics/contra1.png');
    }

    create ()
    {
        this.add.image(0, 0, '1984').setOrigin(0).setScale(2);

        const config = {
            image: 'knighthawks',
            width: 31,
            height: 25,
            chars: Phaser.GameObjects.RetroFont.TEXT_SET6,
            charsPerRow: 10,
            spacing: { x: 1, y: 1 }
        };

        this.cache.bitmapFont.add('knighthawks', Phaser.GameObjects.RetroFont.Parse(this, config));

        this.dynamic = this.add.dynamicBitmapText(0, 100, 'knighthawks', '             PHASER 3 IS IN THE HOUSE');

        this.dynamic.setSize(320, 100);
        this.dynamic.setScale(2);
        this.dynamic.setDisplayCallback(this.textCallback);

        this.tweens.add({
            targets: s,
            duration: 500,
            y: 32,
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: true
        });

        this.add.image(640, 400, 'contra').setOrigin(1).setScale(2);
    }

    //  data = { index: index, charCode: charCode, x: x, y: y, scaleX: scaleX, scaleY: scaleY, data: Object }
    textCallback (data)
    {
        data.y += 32 + s.y * Math.sin(data.index);

        return data;
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
    width: 640,
    height: 480,
    scene: [ Example ]
};

const game = new Phaser.Game(config);

