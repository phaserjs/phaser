class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.atlas('ryu', 'assets/animations/sf2ryu.png', 'assets/animations/sf2ryu.json');
        this.load.image('sea', 'assets/skies/sf2boat.png');
        this.load.image('ground', 'assets/skies/sf2floor.png');
    }

    create ()
    {
        this.add.image(100, 130, 'sea').setScale(3);
        this.add.image(400, 500, 'ground').setScale(3);

        var info = [ 'Click to toggle Animation.yoyo', 'yoyo: true' ];
        var text = this.add.text(400, 32, info, { color: '#113355', align: 'center' }).setOrigin(0.5, 0);

        this.anims.create({
            key: 'hadoken',
            frames: this.anims.generateFrameNames('ryu', { prefix: 'frame_', end: 15, zeroPad: 2 }),
            yoyo: true,
            repeat: -1
        });

        var ryu = this.add.sprite(400, 350).play('hadoken').setScale(3);

        this.input.on('pointerup', function () {

            //  Toggle 'yoyo' at runtime
            ryu.anims.yoyo = !ryu.anims.yoyo;

            info[1] = 'yoyo: ' + ryu.anims.yoyo;

            text.setText(info);

        });
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    pixelArt: true,
    width: 800,
    height: 600,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
