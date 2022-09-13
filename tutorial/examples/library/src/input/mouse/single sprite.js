var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var sprite;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('eye', 'assets/pics/lance-overdose-loader-eye.png');
}

function create ()
{
    sprite = this.add.sprite(400, 300, 'eye');

    sprite.setInteractive();

    sprite.on('pointerdown', function () {

        this.setTint(0xff0000);

    });

    sprite.on('pointerup', function () {

        this.clearTint();

    });

    /*
    this.input.on('gameobjectover', function (pointer, gameObject) {

        gameObject.setTint(0xff0000);

    });

    this.input.on('gameobjectout', function (pointer, gameObject) {

        gameObject.clearTint();

    });
    */
}

function update ()
{
    sprite.rotation += 0.01;
}