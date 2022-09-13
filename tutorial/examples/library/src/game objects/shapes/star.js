var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bg', 'assets/skies/background1.png');
}

function create ()
{
    this.add.image(400, 300, 'bg');

    var r1 = this.add.star(200, 200, 5, 48, 96, 0x6666ff);

    var r2 = this.add.star(400, 200, 5, 48, 96, 0x9966ff);

    r2.setStrokeStyle(4, 0xefc53f);

    var r3 = this.add.star(600, 200, 5, 48, 96);

    r3.setStrokeStyle(2, 0x1a65ac);

    var r4 = this.add.star(200, 400, 5, 48, 96, 0xff6699);

    var r5 = this.add.star(400, 400, 5, 48, 96, 0xff33cc);

    var r6 = this.add.star(600, 400, 8, 48, 96, 0xff66ff);

    this.tweens.add({

        targets: r4,
        scaleX: 0.25,
        scaleY: 0.5,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'

    });

    this.tweens.add({

        targets: r5,
        alpha: 0.2,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'

    });

    this.tweens.add({

        targets: r6,
        angle: 90,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'

    });
}