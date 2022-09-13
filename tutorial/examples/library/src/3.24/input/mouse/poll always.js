var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('eye', 'assets/pics/lance-overdose-loader-eye.png');
}

function create ()
{
    var sprite = this.add.sprite(100, 300, 'eye').setInteractive();

    //  Enable continuous polling

    //  This will check the interactive objects even if you don't move the mouse
    //  So you can leave it in the path of the sprite and it will still fire
    //  over and out events while tweening across the screen, even if you don't
    //  move the mouse.

    this.input.setPollAlways();

    //  Events

    this.input.on('gameobjectover', function (pointer, gameObject) {

        gameObject.setTint(0xff0000);

    });

    this.input.on('gameobjectout', function (pointer, gameObject) {

        gameObject.clearTint();

    });

    this.input.on('pointerdown', function () {
        console.log('down');
    });

    this.tweens.add({

        targets: sprite,
        x: 800,
        yoyo: true,
        repeat: -1,
        duration: 5000

    });
}
