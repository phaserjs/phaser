var config = {
    type: Phaser.AUTO,
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
    this.load.atlas('atlas', 'assets/atlas/megaset-2.png', 'assets/atlas/megaset-2.json');
}

function create ()
{
    this.add.image(400, 300, 'atlas', 'hello').setAlpha(0.3);

    graphics = this.add.graphics();

    bob = this.add.image(400, 300, 'atlas', 'hello');

    var cropWidth = 200;
    var cropHeight = 100;

    bob.setCrop(20, 20, cropWidth, cropHeight);

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
