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

    var data = [ 0,20, 84,20, 84,0, 120,50, 84,100, 84,80, 0,80 ];

    var r1 = this.add.polygon(200, 200, data, 0x6666ff);

    var r2 = this.add.polygon(400, 200, data, 0x9966ff);

    r2.setStrokeStyle(4, 0xefc53f);

    var r3 = this.add.polygon(600, 200, data);

    r3.setStrokeStyle(2, 0x1a65ac);

    var r4 = this.add.polygon(200, 400, data, 0xff6699);

    var r5 = this.add.polygon(400, 400, data, 0xff33cc);

    var r6 = this.add.polygon(600, 400, data, 0xff66ff);

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