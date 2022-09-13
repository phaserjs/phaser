class Preloader extends Phaser.Scene {

    constructor ()
    {
        super('preloader');
    }

    preload ()
    {
        this.load.image('invaders.boom', 'assets/games/multi/boom.png');
        this.load.image('invaders.bullet', 'assets/games/multi/bullet.png', { frameWidth: 12, frameHeight: 14 });
        this.load.image('invaders.bullet2', 'assets/games/multi/bullet2.png');
        this.load.image('invaders.explode', 'assets/games/multi/explode.png');
        this.load.spritesheet('invaders.invader1', 'assets/games/multi/invader1.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('invaders.invader2', 'assets/games/multi/invader2.png', { frameWidth: 22, frameHeight: 16 });
        this.load.spritesheet('invaders.invader3', 'assets/games/multi/invader3.png', { frameWidth: 24, frameHeight: 16 });
        this.load.image('invaders.mothership', 'assets/games/multi/mothership.png');
        this.load.image('invaders.ship', 'assets/games/multi/ship.png');
    }

    create ()
    {
        //  Create animations

        this.anims.create({
            key: 'bullet',
            frames: this.anims.generateFrameNumbers('invaders.bullet'),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'invader1',
            frames: this.anims.generateFrameNumbers('invaders.invader1'),
            frameRate: 2,
            repeat: -1
        });

        this.anims.create({
            key: 'invader2',
            frames: this.anims.generateFrameNumbers('invaders.invader2'),
            frameRate: 2,
            repeat: -1
        });

        this.anims.create({
            key: 'invader3',
            frames: this.anims.generateFrameNumbers('invaders.invader3'),
            frameRate: 2,
            repeat: -1
        });

        this.scene.start('controller');
    }

}
