class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('pic', 'assets/pics/taikodrummaster.jpg');
        this.load.image('mask', 'assets/sprites/mask1.png');
        this.load.image('logo', 'assets/sprites/phaser.png');
    }

    create ()
    {
        const pic = this.add.image(400, 300, 'pic');

        this.add.image(100, 60, 'logo');

        const spotlight = this.make.sprite({
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

        this.tweens.add({
            targets: spotlight,
            alpha: 0,
            duration: 2000,
            ease: 'Sine.easeInOut',
            loop: -1,
            yoyo: true
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
