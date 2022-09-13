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

    var r1 = this.add.arc(200, 200, 80, 0, 240, false, 0x6666ff);

    var r2 = this.add.arc(400, 200, 80, 240, 360, false, 0x9966ff);

    r2.setStrokeStyle(4, 0xefc53f);

    var r3 = this.add.arc(600, 200, 80, 180, 360, false);

    r3.setStrokeStyle(2, 0x1a65ac);

    var r4 = this.add.arc(200, 400, 80, 0, 180, false, 0xff6699);

    var r5 = this.add.arc(400, 400, 80, 90, 240, true, 0xff33cc);

    var r6 = this.add.arc(600, 400, 80, 0, 180, false, 0xff66ff);

    //  WebGL only
    r6.setIterations(0.2);

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