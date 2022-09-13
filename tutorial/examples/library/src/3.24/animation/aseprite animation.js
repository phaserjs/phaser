var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    pixelArt: true,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.path = 'assets/animations/aseprite/';

    this.load.aseprite('paladin', 'paladin.png', 'paladin.json');
}

function create ()
{
    var tags = this.anims.createFromAseprite('paladin');

    var sprite = this.add.sprite(500, 300).play({ key: 'Magnum Break', repeat: -1 }).setScale(6);

    for (var i = 0; i < tags.length; i++)
    {
        var label = this.add.text(32, 32 + (i * 16), tags[i].key, { color: '#00ff00' });

        label.setInteractive();
    }

    this.input.on('gameobjectdown', function (pointer, obj) {

        sprite.play({
            key: obj.text,
            repeat: -1
        });

    });

    this.input.on('gameobjectover', function (pointer, obj) {

        obj.setColor('#ff00ff');

    });

    this.input.on('gameobjectout', function (pointer, obj) {

        obj.setColor('#00ff00');

    });
}
