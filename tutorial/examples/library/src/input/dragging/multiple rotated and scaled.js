var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 1024,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var cards;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('cards', 'assets/atlas/cards.png', 'assets/atlas/cards.json');
}

function create ()
{
    //  Create a stack of random cards
    cards = this.add.group();

    var frames = this.textures.get('cards').getFrameNames();

    for (var i = 0; i < 64; i++)
    {
        var x = Phaser.Math.Between(0, 1024);
        var y = Phaser.Math.Between(0, 600);

        var image = this.add.image(x, y, 'cards', Phaser.Math.RND.pick(frames));

        image.setInteractive();

        image.setScale(Phaser.Math.FloatBetween(0.25, 0.75));

        image.setAngle(Phaser.Math.Between(0, 359));

        this.input.setDraggable(image);

        cards.add(image);
    }

    var _this = this;

    this.input.on('dragstart', function (pointer, gameObject) {

        this.children.bringToTop(gameObject);

    }, this);

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

        gameObject.x = dragX;
        gameObject.y = dragY;

    });
}

function update ()
{
    Phaser.Actions.Rotate(cards.getChildren(), 0.01);
}
