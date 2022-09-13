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

    create()
    {
        var text = this.add.dynamicBitmapText(60, 200, 'desyrel', 'HELLO WORLD!', 64);

        text.setDisplayCallback(this.textCallback);

        this.tweens.add({
            targets: text,
            duration: 2000,
            delay: 2000,
            scaleX: 2,
            scaleY: 2,
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: true
        });
    }

    //  data = { index: index, charCode: charCode, x: x, y: y, scaleX: scaleX, scaleY: scaleY }
    textCallback (data)
    {
        data.x = Phaser.Math.Between(data.x - 2, data.x + 2);
        data.y = Phaser.Math.Between(data.y - 4, data.y + 4);

        return data;
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
