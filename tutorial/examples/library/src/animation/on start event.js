class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
        this.isRunning = false;
    }

    preload ()
    {
        this.load.atlas('knight', 'assets/animations/knight.png', 'assets/animations/knight.json');
        this.load.image('bg', 'assets/skies/clouds.png');
        this.load.spritesheet('tiles', 'assets/tilemaps/tiles/fantasy-tiles.png', { frameWidth: 64, frameHeight: 64 });
    }

    create ()
    {
        //  The background and floor
        this.bg = this.add.tileSprite(0, 16, 800, 600, 'bg').setOrigin(0);
        this.ground = this.add.tileSprite(0, 536, 800, 64, 'tiles', 1).setOrigin(0);

        this.add.text(400, 8, 'Click to start running animation', { color: '#ffffff' }).setOrigin(0.5, 0);

        //  Our animations

        const idleConfig = {
            key: 'idle',
            frames: this.anims.generateFrameNames('knight', { prefix: 'idle/frame', start: 0, end: 5, zeroPad: 4 }),
            frameRate: 14,
            repeat: -1
        };

        this.anims.create(idleConfig);

        const runConfig = {
            key: 'run',
            frames: this.anims.generateFrameNames('knight', { prefix: 'run/frame', start: 0, end: 7, zeroPad: 4 }),
            frameRate: 12,
            repeat: -1
        };

        this.anims.create(runConfig);

        const lancelot = this.add.sprite(400, 536, 'knight');

        lancelot.setOrigin(0.5, 1);
        lancelot.setScale(8);
        lancelot.play('idle');

        //  Event handler for when the animation completes on our sprite
        lancelot.on(Phaser.Animations.Events.ANIMATION_START, function () {

            this.isRunning = true;

        }, this);

        //  And a click handler to stop the animation
        this.input.once('pointerdown', function () {

            lancelot.play('run');

        });
    }

    update ()
    {
        if (this.isRunning)
        {
            this.bg.tilePositionX += 4;
            this.ground.tilePositionX += 8;
        }
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#026bc6',
    pixelArt: true,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
