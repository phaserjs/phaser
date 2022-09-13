class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('pic', 'assets/pics/sword-art-online.jpg');
        this.load.image('magnify-out', 'assets/sprites/magnify-glass-outside.png');
        this.load.image('magnify-in', 'assets/sprites/magnify-glass-inside.png');
    }

    create ()
    {
        this.add.image(400, 300, 'pic').setTint(0x2d2d2d);

        //  The scale creates a slight magnification effect
        const pic = this.add.image(400, 300, 'pic').setScale(1.05);

        const lense = this.make.sprite({
            x: 400,
            y: 300,
            key: 'magnify-in',
            add: false
        });

        pic.mask = new Phaser.Display.Masks.BitmapMask(this, lense);

        const magnify = this.add.image(400, 300, 'magnify-out');

        this.input.on('pointermove', function (pointer) {

            lense.x = pointer.x;
            lense.y = pointer.y;

            magnify.x = pointer.x;
            magnify.y = pointer.y;

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
