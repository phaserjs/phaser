class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.atlas('alien', 'assets/animations/alien.png', 'assets/animations/alien.json');
        this.load.image('bg', 'assets/pics/space-wreck.jpg');
    }

    create ()
    {
        this.add.image(400, 300, 'bg');

        const text = this.add.text(400, 32, "Click to toggle sequence", { color: '#00ff00' }).setOrigin(0.5, 0);

        //  Our global animations, as defined in the texture atlas
        this.anims.create({ key: 'idle', frames: this.anims.generateFrameNames('alien', { prefix: '01_Idle_', end: 17, zeroPad: 3 }), repeat: -1, repeatDelay: 500, frameRate: 18 });
        this.anims.create({ key: 'turn', frames: this.anims.generateFrameNames('alien', { prefix: '02_Turn_to_walk_', end: 3, zeroPad: 3 }), frameRate: 12 });
        this.anims.create({ key: 'walk', frames: this.anims.generateFrameNames('alien', { prefix: '03_Walk_', end: 12, zeroPad: 3 }), repeat: -1, frameRate: 18 });

        const ripley = this.add.sprite(400, 300, 'alien').play('idle');

        this.input.on('pointerdown', function () {

            if (ripley.anims.getName() === 'idle')
            {
                //  When the current animation repeat ends, we'll play the 'turn' animation
                ripley.anims.playAfterRepeat('turn');

                //  And after that, the 'walk' look
                ripley.anims.chain('walk');
            }
            else
            {
                ripley.anims.play('idle');
            }

        });
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
