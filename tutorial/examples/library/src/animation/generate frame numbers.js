class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.spritesheet('boom', 'assets/sprites/explosion.png', { frameWidth: 64, frameHeight: 64, endFrame: 23 });
    }

    create ()
    {
        this.add.text(400, 32, 'Check the source code for comments', { color: '#00ff00' }).setOrigin(0.5, 0);

        //  Our 'boom' spritesheet has 23 frames in it.
        //  This animation will use them all by just giving it the sprite sheet key:
        const config1 = {
            key: 'explode1',
            frames: 'boom',
            frameRate: 20,
            repeat: -1
        };

        //  Here we use the 'generateFrameNumbers' function instead to set the start and end frame:
        const config2 = {
            key: 'explode2',
            frames: this.anims.generateFrameNumbers('boom', { start: 0, end: 23 }),
            frameRate: 20,
            repeat: -1
        };

        //  Here we use the 'frames' array because we want to specify the exact frames to use:
        const config3 = {
            key: 'explode3',
            frames: this.anims.generateFrameNumbers('boom', { frames: [ 0, 1, 2, 1, 2, 3, 4, 0, 1, 2 ] }),
            frameRate: 20,
            repeat: -1
        };

        this.anims.create(config1);
        this.anims.create(config2);
        this.anims.create(config3);

        this.add.sprite(200, 300, 'boom').play('explode1');
        this.add.sprite(400, 300, 'boom').play('explode2');
        this.add.sprite(600, 300, 'boom').play('explode3');
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
