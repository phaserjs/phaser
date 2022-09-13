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
    this.add.sprite(300, 200, 'eye').setInteractive();
    this.add.sprite(400, 300, 'eye').setInteractive();
    this.add.sprite(500, 400, 'eye').setInteractive();

    //  Events

    this.input.on('pointerover', function (event, gameObjects) {

        gameObjects[0].setTint(0xff0000);

    });

    this.input.on('pointerout', function (event, gameObjects) {

        gameObjects[0].clearTint();

    });
}
