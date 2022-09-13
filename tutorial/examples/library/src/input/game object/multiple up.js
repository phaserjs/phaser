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

    this.input.on('gameobjectup', function (pointer, gameObject) {

        this.tweens.add({
            targets: gameObject,
            alpha: 0,
            scaleX: 0,
            scaleY: 0
        });

    }, this);
}

//  Creates 64 random card sprites on the screen and sets them all to be interactive
function createCards ()
{
    var frames = this.textures.get('cards').getFrameNames();

    for (var i = 0; i < 64; i++)
    {
        var x = Phaser.Math.Between(0, 800);
        var y = Phaser.Math.Between(0, 600);
        var s = Phaser.Math.FloatBetween(0.5, 1);

        this.add.image(x, y, 'cards', Phaser.Math.RND.pick(frames)).setScale(s).setInteractive();
    }
}
