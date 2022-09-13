var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        extend: {
            createCards: createCards
        }
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('cards', 'assets/atlas/cards.png', 'assets/atlas/cards.json');
}

function create ()
{
    this.createCards();

    this.input.on('gameobjectover', function (pointer, gameObject) {

        gameObject.setTint(0xff0000);

    });

    this.input.on('gameobjectout', function (pointer, gameObject) {

        gameObject.clearTint();

    });
}

function createCards ()
{
    var frames = this.textures.get('cards').getFrameNames();

    for (var i = 0; i < 64; i++)
    {
        var x = Phaser.Math.Between(0, 800);
        var y = Phaser.Math.Between(0, 600);
        var s = Phaser.Math.FloatBetween(0.4, 0.6);

        this.add.image(x, y, 'cards', Phaser.Math.RND.pick(frames)).setScale(s).setInteractive();
    }
}
