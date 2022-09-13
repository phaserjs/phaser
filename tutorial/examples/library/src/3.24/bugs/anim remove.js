class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('img1', 'assets/pics/ayu.png');
        this.load.image('img2', 'assets/pics/ayu2.png');
    }

    create ()
    {
        let anim = this.anims.create({
            key: 'test',
            frames: [{
                key: 'img1'
            }, {
                key: 'img2'
            }],
            frameRate: 4,
            repeat: -1
        });

        // anim.removeFrameAt(1);

        this.add.sprite(400, 300).play('test');

        this.input.once('pointerdown', () => {

            anim.removeFrameAt(1);

        });
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: Example
};

let game = new Phaser.Game(config);
