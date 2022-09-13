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

    var r1 = this.add.line(200, 200, 0, 0, 140, 0, 0x6666ff);

    var r2 = this.add.line(400, 200, 0, 0, 140, 0, 0x9966ff);

    //  WebGL only
    r2.setLineWidth(10, 40);

    var r3 = this.add.line(600, 200, 0, 0, 140, 0, 0x1a65ac);

    //  WebGL only
    r3.setLineWidth(1, 16);

    var r4 = this.add.line(200, 400, 0, 0, 140, 0, 0xff6699);

    var r5 = this.add.line(400, 400, 0, 0, 140, 0, 0xff33cc);

    var r6 = this.add.line(600, 400, 0, 0, 140, 0, 0xff66ff);

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