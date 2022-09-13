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

    for (var i = 0; i < 200; i++)
    {
        var x = Phaser.Math.Between(0, 2048);
        var y = Phaser.Math.Between(0, 1200);

        var image = this.add.image(x, y, 'cards', Phaser.Math.RND.pick(frames));

        image.setInteractive();

        image.setScale(Phaser.Math.FloatBetween(0.25, 1.0));

        image.setScrollFactor(image.scaleX);

        image.setDepth(image.scrollFactorX);

        image.setAngle(Phaser.Math.Between(0, 359));

        this.input.setDraggable(image);

        cards.add(image);
    }

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

        gameObject.x = dragX;
        gameObject.y = dragY;

    });

    var cursors = this.input.keyboard.createCursorKeys();

    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        acceleration: 0.04,
        drag: 0.0005,
        maxSpeed: 0.7
    };

    controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

    this.cameras.main.setBounds(0, 0, 2048, 1200);
}

function update (time, delta)
{
    controls.update(delta);

    Phaser.Actions.Rotate(cards.getChildren(), 0.01);
}
