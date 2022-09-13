var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: 0x2d2d2d,
    scene: {
        create: create,
        update: update
    }
};

var bob;
var graphics;
var offset;

var game = new Phaser.Game(config);

function create ()
{
    var dull = this.add.text(400, 300, "Phaser 3\nText Crop\nHell Yeah!", { fontFamily: "Arial Black", fontSize: 74, color: "#c51b7d", align: 'center' }).setStroke('#de77ae', 16);
    dull.setAlpha(0.15).setOrigin(0.5);
    // dull.setFlipX(true);
    // dull.setFlipY(true);

    bob = this.add.text(400, 300, "Phaser 3\nText Crop\nHell Yeah!", { fontFamily: "Arial Black", fontSize: 74, color: "#c51b7d", align: 'center' }).setStroke('#de77ae', 16).setOrigin(0.5);
    // bob.setFlipX(true);
    // bob.setFlipY(true);

    graphics = this.add.graphics();

    var cropWidth = 200;
    var cropHeight = 50;

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
