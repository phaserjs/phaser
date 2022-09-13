var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('pic', 'assets/pics/taikodrummaster.jpg');
    this.load.image('mask', 'assets/sprites/mask2.png');
    this.load.image('logo', 'assets/sprites/phaser.png');
}

function create ()
{
    this.add.image(100, 60, 'logo');

    var pic = this.add.image(400, 300, 'pic');

    var spotlight = this.make.sprite({
        x: 400,
        y: 300,
        key: 'mask',
        add: false
    });

    pic.mask = new Phaser.Display.Masks.BitmapMask(this, spotlight);

    this.input.on('pointermove', function (pointer) {

        spotlight.x = pointer.x;
        spotlight.y = pointer.y;

    });
}
