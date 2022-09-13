var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#efefef',
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

    var g1 = this.add.grid(100, 100, 128, 96, 32, 32, 0x057605);

    var g2 = this.add.grid(300, 340, 512, 256, 64, 64, 0x00b9f2).setAltFillStyle(0x016fce).setOutlineStyle();

    var g3 = this.add.grid(600, 300, 100, 500, 48, 128, 0xc145ea).setAltFillStyle(0xb038d7).setOutlineStyle().setAngle(-20);

    this.tweens.add({

        targets: g1,
        scaleX: 0.25,
        scaleY: 0.5,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'

    });

    this.tweens.add({

        targets: g3,
        width: 400,
        angle: -90,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'

    });
}
