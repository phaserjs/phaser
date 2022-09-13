var config = {
    type: Phaser.WEBGL,
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
    this.load.image('eye', 'assets/pics/lance-overdose-loader-eye.png');
}

function create ()
{
    this.add.sprite(100, 100, 'eye').setInteractive().setOrigin(0);
    this.add.sprite(300, 100, 'eye').setInteractive().setOrigin(0.5, 0);
    this.add.sprite(600, 100, 'eye').setInteractive().setOrigin(1, 0);
    this.add.sprite(200, 400, 'eye').setInteractive().setOrigin(1, 1);
    this.add.sprite(400, 400, 'eye').setInteractive().setOrigin(1, 0.2);
    this.add.sprite(600, 400, 'eye').setInteractive().setOrigin(0.6, 0.4);

    this.input.on('gameobjectover', function (pointer, gameObject) {

        gameObject.setTint(0xff0000);

    });

    this.input.on('gameobjectout', function (pointer, gameObject) {

        gameObject.clearTint();

    });
}
