var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    pixelArt: true,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var gem;
var debug;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('gems', 'assets/animations/diamond.png', 'assets/animations/diamond.json');
}

function create ()
{
    this.anims.create({
        key: 'diamond',
        frames: this.anims.generateFrameNames('gems', { prefix: 'diamond_', end: 15, zeroPad: 4 }),
        frameRate: 16,
        yoyo: true,
        repeat: -1,
        repeatDelay: 300
    });

    gem = this.add.sprite(400, 480, 'gems').play('diamond').setScale(4);

    debug = this.add.graphics();
}

function update ()
{
    debug.clear();

    var size = 672;

    debug.fillStyle(0x2d2d2d);
    debug.fillRect(64, 64, size, 48);

    debug.fillStyle(0x2dff2d);
    debug.fillRect(64, 64, size * gem.anims.getProgress(), 48);
}
