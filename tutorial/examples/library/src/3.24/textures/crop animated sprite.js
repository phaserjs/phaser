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
var px;
var py;
var cropWidth;
var cropHeight;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('sea', 'assets/animations/seacreatures_json.png', 'assets/animations/seacreatures_json.json');
}

function create ()
{
    this.anims.create({ key: 'stingray', frames: this.anims.generateFrameNames('sea', { prefix: 'stingray', end: 23, zeroPad: 4 }), repeat: -1 });

    this.add.sprite(400, 300, 'sea').setAlpha(0.3).play('stingray');

    bob = this.add.sprite(400, 300, 'sea').play('stingray');

    graphics = this.add.graphics();

    cropWidth = 64;
    cropHeight = 64;
    px = 0;
    py = 0;

    bob.setCrop(0, 0, cropWidth, cropHeight);

    offset = bob.getTopLeft();

    this.input.on('pointermove', function (pointer) {

        px = pointer.x - offset.x;
        py = pointer.y - offset.y;

    });
}

function update ()
{
    bob.setCrop(
        px - cropWidth / 2,
        py - cropHeight / 2,
        cropWidth,
        cropHeight
    );

    graphics.clear();
    graphics.lineStyle(1, 0x00ff00);
    graphics.strokeRect(offset.x + bob._crop.x, offset.y + bob._crop.y, bob._crop.width, bob._crop.height);
}
