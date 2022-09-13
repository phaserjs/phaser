var config2 = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload2,
        create: create2
    }
};

function preload2 ()
{
    this.load.image('taikodrummaster', 'assets/pics/taikodrummaster.jpg');
    this.load.image('sukasuka-chtholly', 'assets/pics/sukasuka-chtholly.png');
}

function create2 ()
{
    this.add.image(400, 300, 'taikodrummaster');

    var chtholly = this.add.image(400, 500, 'sukasuka-chtholly').setInteractive();

    var tween = this.tweens.add({
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

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

function preload ()
{
    this.load.image('taikodrummaster', 'assets/pics/taikodrummaster.jpg');
    this.load.image('sukasuka-chtholly', 'assets/pics/sukasuka-chtholly.png');
}

function create ()
{
    this.add.image(400, 300, 'taikodrummaster');

    var chtholly = this.add.image(400, 500, 'sukasuka-chtholly').setInteractive();

    var tween = this.tweens.add({
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

var game1 = new Phaser.Game(config);
var game2 = new Phaser.Game(config2);
