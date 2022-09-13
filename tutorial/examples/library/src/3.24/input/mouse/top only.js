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
    var sprite1 = this.add.sprite(400, 300, 'eye').setInteractive();
    var sprite2 = this.add.sprite(450, 350, 'eye').setInteractive();

    sprite1.name = 'bob';
    sprite2.name = 'ben';

    this.input.topOnly = true;

    this.input.on('gameobjectover', function (pointer, gameObject) {

        gameObject.setTint(0x00ff00);

    });

    this.input.on('gameobjectout', function (pointer, gameObject) {

        if (gameObject.input.isDown)
        {
            gameObject.setTint(0xff0000);
        }
        else
        {
            gameObject.clearTint();
        }

    });

    this.input.on('gameobjectdown', function (pointer, gameObject) {

        gameObject.setTint(0xff0000);

    });

    this.input.on('gameobjectup', function (pointer, gameObject) {

        if (gameObject.input.isOver)
        {
            gameObject.setTint(0x00ff00);
        }
        else
        {
            gameObject.clearTint();
        }

    });
}
