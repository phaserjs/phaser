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
        const config = {
            key: 'explode',
            frames: 'boom',
            frameRate: 30,
            repeat: -1,
            repeatDelay: 2000
        };

        this.anims.create(config);

        for (let i = 0; i < 256; i++)
        {
            let x = Phaser.Math.Between(0, 800);
            let y = Phaser.Math.Between(0, 600);

            let boom = this.add.sprite(x, y, 'boom', 23);

            //  Each one can have a random start delay
            boom.play({
                key: 'explode',
                delay: Math.random() * 3000
            });
        }
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
