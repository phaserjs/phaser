var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#010101',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('buttonBG', 'assets/sprites/button-bg.png');
    this.load.image('buttonText', 'assets/sprites/button-text.png');
}

function create ()
{
    var bg = this.add.image(0, 0, 'buttonBG').setInteractive();
    var text = this.add.image(0, 0, 'buttonText');

    var container = this.add.container(400, 300, [ bg, text ]);

    container.setAngle(20);

    this.tweens.add({
        targets: text,
        alpha: 0.5,
        duration: 1000,
        ease: 'Sine.easeOut',
        yoyo: true,
        repeat: -1
    });

    bg.on('pointerover', function () {

        this.setTint(0x44ff44);

    });

    bg.on('pointerout', function () {

        this.clearTint();

    });

    bg.once('pointerup', function () {

        this.tweens.add({
            targets: container,
            y: 900,
            duration: 500
        });

    }, this);
}
