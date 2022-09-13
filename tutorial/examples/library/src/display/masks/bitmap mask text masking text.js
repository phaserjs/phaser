class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('bunny', 'assets/sprites/bunny.png');
        this.load.image('phaser2', 'assets/sprites/phaser2.png');
        this.load.image('checker', 'assets/pics/checker.png');
        this.load.bitmapFont('desyrel', 'assets/fonts/bitmap/desyrel.png', 'assets/fonts/bitmap/desyrel.xml');
    }

    create ()
    {

        const checker = this.make.image({
            x: game.config.width / 2,
            y: game.config.height / 2,
            key: 'checker',
            add: true
        });

        const phaser2 = this.add.text(100, 300, 'PHASER').setFont('128px Arial').setColor('#ffff00').setAlign('center');
        const text = this.add.text(100, 300, 'PHASER').setFont('128px Impact').setColor('#ff0000').setAlign('center');
        phaser2.setOrigin(0.5);

        text.mask = new Phaser.Display.Masks.BitmapMask(this, phaser2);

        this.input.on('pointermove', function (pointer) {

            phaser2.x = pointer.x;
            phaser2.y = pointer.y;

            phaser2.setText('PHASER\nX: ' + phaser2.x + '\nY: ' + phaser2.y);
            text.setText('PHASER\nX: ' + phaser2.x + '\nY: ' + phaser2.y);

        });

        const bmtext = this.add.dynamicBitmapText(60, 200, 'desyrel', 'PHASER', 72);

        bmtext.setDisplayCallback(this.textCallback);

        this.tweens.add({
            targets: bmtext,
            duration: 2000,
            delay: 2000,
            scaleX: 2,
            scaleY: 2,
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: true
        });

        bmtext.mask = new Phaser.Display.Masks.BitmapMask(this, phaser2);
    }

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
    width: 640,
    height: 480,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
