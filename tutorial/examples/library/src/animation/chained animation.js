class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
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
        this.add.image(400, 16, 'bg').setOrigin(0.5, 0);

        for (var i = 0; i < 13; i++)
        {
            this.add.image(64 * i, 536, 'tiles', 1).setOrigin(0);
        }

        var text = this.add.text(400, 8, 'Click to play animation chain', { color: '#ffffff' }).setOrigin(0.5, 0);

        //  Our animations
        this.anims.create({
            key: 'guardStart',
            frames: this.anims.generateFrameNames('knight', { prefix: 'guard_start/frame', start: 0, end: 3, zeroPad: 4 }),
            frameRate: 8
        });

        this.anims.create({
            key: 'guard',
            frames: this.anims.generateFrameNames('knight', { prefix: 'guard/frame', start: 0, end: 5, zeroPad: 4 }),
            frameRate: 8,
            repeat: 2
        });

        this.anims.create({
            key: 'guardEnd',
            frames: this.anims.generateFrameNames('knight', { prefix: 'guard_end/frame', start: 0, end: 3, zeroPad: 4 }),
            frameRate: 8
        });

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNames('knight', { prefix: 'idle/frame', start: 0, end: 5, zeroPad: 4 }),
            frameRate: 8,
            repeat: -1
        });

        var lancelot = this.add.sprite(500, 536)

        lancelot.setOrigin(0.5, 1);
        lancelot.setScale(8);
        lancelot.play('idle');

        lancelot.on(Phaser.Animations.Events.SPRITE_ANIMATION_START, function (anim) {

            text.setText('Playing ' + anim.key);

        });

        this.input.on('pointerdown', function () {

            if (lancelot.anims.getName() === 'idle')
            {
                lancelot.playAfterRepeat('guardStart');
                lancelot.chain([ 'guard', 'guardEnd', 'idle' ]);
            }

        }, this);
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
