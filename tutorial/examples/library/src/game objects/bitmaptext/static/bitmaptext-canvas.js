let value = 0;
class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.bitmapFont('desyrel', 'assets/fonts/bitmap/desyrel.png', 'assets/fonts/bitmap/desyrel.xml');
        this.load.bitmapFont('desyrelPink', 'assets/fonts/bitmap/desyrel-pink.png', 'assets/fonts/bitmap/desyrel-pink.xml');
    }

    create ()
    {
        this.dynamic1 = this.add.bitmapText(0, 0, 'desyrel', 'hello world', 8);

        this.tweens.add({
            targets: this.dynamic1,
            duration: 2000,
            fontSize: 128,
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: true
        });

        this.dynamic2 = this.add.bitmapText(0, 200, 'desyrelPink', 'hello world', 32);

        this.tweens.add({
            targets: this.dynamic2,
            duration: 2000,
            scaleX: 6,
            scaleY: 4,
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: true
        });
    }

    update ()
    {
        this.dynamic1.text = 'Value: ' + value.toFixed(2);
        this.dynamic2.text = 'Value: ' + value.toFixed(2);

        value += 0.01;
    }
}

const config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
