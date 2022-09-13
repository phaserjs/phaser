const scale = { i: -64, x: 16, y: -16 };
//  data = { index: index, charCode: charCode, x: x, y: y, scaleX: scaleX, scaleY: scaleY }

class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.bitmapFont('desyrel', 'assets/fonts/bitmap/desyrel.png', 'assets/fonts/bitmap/desyrel.xml');

    }

    create ()
    {
        const text = this.add.dynamicBitmapText(60, 200, 'desyrel', 'Hello World!', 64);

        text.setDisplayCallback(this.textCallback);

        this.tweens.add({
            targets: scale,
            duration: 1000,
            i: 64,
            x: -16,
            y: 16,
            ease: 'Linear',
            repeat: -1,
            yoyo: true
        });
    }

    textCallback (data)
    {
        data.y += scale.y * data.index;

        // if (data.index % 2)
        // {
        //     data.y += scale.x;
        // }
        // else
        // {
        //     data.y += scale.y;
        // }

        return data;
    }
}
const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);

