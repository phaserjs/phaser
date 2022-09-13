class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.atlas('cube', 'assets/animations/cube.png', 'assets/animations/cube.json');
    }

    create ()
    {
        //  Our global 'spin' animation
        this.anims.create({
            key: 'spin',
            frames: this.anims.generateFrameNames('cube', { prefix: 'frame', start: 1, end: 23 }),
            frameRate: 50,
            repeat: -1
        });

        const colors = [ 0xef658c, 0xff9a52, 0xffdf00, 0x31ef8c, 0x21dfff, 0x31aade, 0x5275de, 0x9c55ad, 0xbd208c ];

        const sprite1 = this.add.sprite(200, 300, 'cube').setTint(colors[0]);
        const sprite2 = this.add.sprite(400, 300, 'cube').setTint(colors[1]);
        const sprite3 = this.add.sprite(600, 300, 'cube').setTint(colors[2]);

        //  Play the 'spin' animation
        sprite1.play({ key: 'spin' });

        //  Play the animation and override the default frameRate with a new one
        sprite2.play({ key: 'spin', frameRate: 20 });

        //  Play the animation and set the repeatDelay to 250ms
        sprite3.play({ key: 'spin', repeatDelay: 250 });
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
