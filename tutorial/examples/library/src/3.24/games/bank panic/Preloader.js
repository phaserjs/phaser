export default class Preloader extends Phaser.Scene
{
    constructor ()
    {
        super('Preloader');
    }

    preload ()
    {
        this.loading = this.add.image(512, 384, 'loading');

        this.load.setPath('assets/games/bank-panic/');

        this.load.image('start');
        this.load.image('title');
        this.load.image('logo');
        this.load.image('background');
        this.load.image('bulletHole', 'bullet-hole.png');
        this.load.atlas('assets', 'bank-panic.png', 'bank-panic.json');

        this.load.audio('shot', [ 'shot.ogg', 'shot.m4a', 'shot.mp3' ]);
        this.load.audio('banditShot', [ '50cal.ogg', '50cal.m4a', '50cal.mp3' ]);
        this.load.audio('money', [ 'money.ogg', 'money.m4a', 'money.mp3' ]);
        this.load.audio('levelComplete', [ 'complete.ogg', 'complete.m4a', 'complete.mp3' ]);
        this.load.audio('gameOver', [ 'gameover.ogg', 'gameover.m4a', 'gameover.mp3' ]);
        this.load.audio('music', [ 'music.ogg', 'music.m4a', 'music.mp3' ]);
        this.load.audio('door', [ 'door.ogg', 'door.m4a', 'door.mp3' ]);
        this.load.audio('scream1', [ 'scream1.ogg', 'scream1.m4a', 'scream1.mp3' ]);
        this.load.audio('scream2', [ 'scream2.ogg', 'scream2.m4a', 'scream2.mp3' ]);
        this.load.audio('scream3', [ 'scream3.ogg', 'scream3.m4a', 'scream3.mp3' ]);
    }

    create ()
    {
        //  Create our global animations

        this.anims.create({
            key: 'doorOpen',
            frames: this.anims.generateFrameNames('assets', { prefix: 'door', start: 1, end: 5 }),
            frameRate: 20
        });

        this.anims.create({
            key: 'doorClose',
            frames: this.anims.generateFrameNames('assets', { prefix: 'door', start: 5, end: 1 }),
            frameRate: 20
        });

        this.loading.setTexture('start');

        this.loading.setInteractive();

        this.loading.once('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}
