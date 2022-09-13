class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('pic', 'assets/pics/taikodrummaster.jpg');
        this.load.image('mask', 'assets/sprites/mask2.png');
        this.load.image('logo', 'assets/sprites/phaser.png');
    }

    create ()
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
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
