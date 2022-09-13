let i = 0;
let hsv = [];

class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.bitmapFont('ice', 'assets/fonts/bitmap/iceicebaby.png', 'assets/fonts/bitmap/iceicebaby.xml');
    }

    create ()
    {
        hsv = Phaser.Display.Color.HSVColorWheel();

        const tintedText = this.add.dynamicBitmapText(32, 64, 'ice', '- Phaser III -', 128);
        tintedText.setDisplayCallback(this.textCallback);
    }

    textCallback (data)
    {
        data.tint.topLeft = hsv[Math.floor(i)].color;
        data.tint.topRight = hsv[359 - Math.floor(i)].color;
        data.tint.bottomLeft = hsv[359 - Math.floor(i)].color;
        data.tint.bottomRight = hsv[Math.floor(i)].color;

        i += 0.05;

        if (i >= hsv.length)
        {
            i = 0;
        }

        return data;
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    backgroundColor: '#2d2d2d',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
