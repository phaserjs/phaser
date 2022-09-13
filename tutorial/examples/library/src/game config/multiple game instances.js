// Game 1
class Example1 extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('taikodrummaster', 'assets/pics/taikodrummaster.jpg');
        this.load.image('sukasuka-chtholly', 'assets/pics/sukasuka-chtholly.png');
    }

    create ()
    {
        this.add.image(400, 300, 'taikodrummaster');

        const chtholly = this.add.image(400, 500, 'sukasuka-chtholly').setInteractive();

        const tween = this.tweens.add({
            targets: chtholly,
            y: 600,
            ease: 'Sine.easeInOut',
            duration: 2000,
            yoyo: true,
            repeat: -1
        });

        chtholly.on('pointerdown', function () {

            if (tween.isPlaying())
            {
                tween.pause();
            }
            else
            {
                tween.resume();
            }

        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: [ Example1 ]
};

const game1 = new Phaser.Game(config);


// Game 2
class Example2 extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('taikodrummaster', 'assets/pics/taikodrummaster.jpg');
        this.load.image('sukasuka-chtholly', 'assets/pics/sukasuka-chtholly.png');
    }

    create ()
    {
        this.add.image(400, 300, 'taikodrummaster');

        const chtholly = this.add.image(400, 500, 'sukasuka-chtholly').setInteractive();

        const tween = this.tweens.add({
            targets: chtholly,
            x: 200,
            ease: 'Sine.easeInOut',
            duration: 2000,
            yoyo: true,
            repeat: -1
        });

        chtholly.on('pointerdown', function () {

            if (tween.isPlaying())
            {
                tween.pause();
            }
            else
            {
                tween.resume();
            }

        });
    }
}

const config2 = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: [ Example2 ]
};

const game2 = new Phaser.Game(config2);
