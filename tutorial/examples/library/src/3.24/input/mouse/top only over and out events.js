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
    var sprite1 = this.add.sprite(400, 300, 'eye').setInteractive();
    var sprite2 = this.add.sprite(450, 350, 'eye').setInteractive();
    var sprite3 = this.add.sprite(500, 400, 'eye').setInteractive();

    //  If you disable topOnly it will fire events for all objects the pointer is over, regardless of place on the display list
    this.input.topOnly = false;

    //  Events

    this.input.on('gameobjectover', function (pointer, gameObject) {

        gameObject.setTint(0xff0000);

    });

    this.input.on('gameobjectout', function (pointer, gameObject) {

        gameObject.clearTint();

    });
}
