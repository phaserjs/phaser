class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('171', 'assets/fonts/retro/171.png');
        this.load.image('rain', 'assets/pics/shadow-of-the-beast2-karamoon.png');
        this.load.image('contra', 'assets/pics/contra2.png');
    }

    create ()
    {
        this.add.image(0, 0, 'rain').setOrigin(0).setScale(2);

        const config = {
            image: '171',
            width: 16,
            height: 18,
            chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ| 0123456789*#!@:.,\\?-+=^$£()\'',
            charsPerRow: 19,
            spacing: { x: 0, y: 1 }
        };

        this.cache.bitmapFont.add('171', Phaser.GameObjects.RetroFont.Parse(this, config));

        this.scrollers = this.add.group();

        for (let i = 0; i < 20; i++)
        {
            const t = this.add.dynamicBitmapText(0, i * 40, '171', '                                 PHASER 3 IS IN THE HOUSE ... WELCOME TO THIS BITMAP TEXT SCROLLER DEMO, SHOWING OFF A NICE NEW FEATURE!!! AND WRAPP........');

            t.setSize(640, 18);

            t.setScale(2);

            this.scrollers.add(t);
        }

        this.add.image(640, 800, 'contra').setOrigin(0.5, 1).setScale(2);
    }

    update (time, delta)
    {
        this.scrollers.children.iterate(function (child, index) {

            child.scrollX += 2.5 + Math.sin((0.01 * index) * delta);

            if (child.scrollX > 2800)
            {
                child.scrollX = -200;
            }

        });
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    pixelArt: true,
    width: 640 * 2,
    height: 400 * 2,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
