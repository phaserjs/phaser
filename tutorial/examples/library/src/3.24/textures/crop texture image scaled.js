var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#2d2d88',
    pixelArt: true,
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
    this.load.image('pic', 'assets/sprites/hotdog.png');
}

function create ()
{
    this.add.image(400, 300, 'pic').setAlpha(0.3).setScale(2);

    bob = this.add.image(400, 300, 'pic').setScale(2);

    graphics = this.add.graphics();

    var cropRect = new Phaser.Geom.Rectangle(0, 0, 100, 40);

    bob.setCrop(cropRect);

    offset = bob.getTopLeft();

    this.input.on('pointermove', function (pointer) {

        bob.setCrop(
            (pointer.x - offset.x - cropRect.width) / 2,
            (pointer.y - offset.y - cropRect.height) / 2,
            cropRect.width,
            cropRect.height
        );

    });
}

function update ()
{
    graphics.clear();
    graphics.lineStyle(1, 0x00ff00);
    graphics.strokeRect(offset.x + (bob._crop.x * 2), offset.y + (bob._crop.y * 2), bob._crop.width * 2, bob._crop.height * 2);
}
