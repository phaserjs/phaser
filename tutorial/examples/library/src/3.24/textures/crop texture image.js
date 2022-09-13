var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#2d2d88',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var bob;
var graphics;
var offset;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('pic', 'assets/pics/kris-jovo.jpg');
}

function create ()
{
    this.add.image(400, 300, 'pic').setAlpha(0.3);

    bob = this.add.image(400, 300, 'pic');

    graphics = this.add.graphics();

    var cropWidth = 200;
    var cropHeight = 100;

    bob.setCrop(0, 0, cropWidth, cropHeight);

    offset = bob.getTopLeft();

    this.input.on('pointermove', function (pointer) {

        bob.setCrop(
            (pointer.x - offset.x) - cropWidth / 2,
            (pointer.y - offset.y) - cropHeight / 2,
            cropWidth,
            cropHeight
        );
    });
}

function update ()
{
    graphics.clear();
    graphics.lineStyle(1, 0x00ff00);
    graphics.strokeRect(offset.x + bob._crop.x, offset.y + bob._crop.y, bob._crop.width, bob._crop.height);
}
