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
    for (var i = 0; i < 14; i++)
    {
        this.add.sprite(100 + i * 30, 100 + i * 30, 'eye').setInteractive();
    }

    //  If you disable topOnly it will fire events for all objects the pointer is over
    //  regardless of their place on the display list
    this.input.setTopOnly(false);

    //  Events

    this.input.on('gameobjectdown', function (pointer, gameObject) {

        gameObject.setTint(0x00ff00);

    });

    this.input.on('gameobjectout', function (pointer, gameObject) {

        gameObject.clearTint();

    });

    this.input.on('gameobjectup', function (pointer, gameObject) {

        gameObject.clearTint();

    });
}
