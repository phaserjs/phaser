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

        this.add.text(400, 8, 'Click to play animation', { color: '#ffffff' }).setOrigin(0.5, 0);

        //  Our attack animation
        const animConfig = {
            key: 'attack',
            frames: this.anims.generateFrameNames('knight', { prefix: 'attack_A/frame', start: 0, end: 13, zeroPad: 4 }),
            frameRate: 12
        };

        this.anims.create(animConfig);

        const lancelot = this.add.sprite(400, 536, 'knight', 'attack_A/frame0000')

        lancelot.setOrigin(0.5, 1);
        lancelot.setScale(8);

        // Event handler for when the animation completes on our sprite
        lancelot.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function () {
            this.releaseItem();
        }, this);

        //  And a click handler to start the animation playing
        this.input.on('pointerdown', function () {
            lancelot.play('attack', true);
        });
    }

    releaseItem() {
        const item = this.add.image(500, 500, 'tiles', 54);

        this.tweens.add({
            targets: item,
            props: {
                y: {
                    value: -64,
                    ease: 'Linear',
                    duration: 3000,
                },
                x: {
                    value: '+=128',
                    ease: 'Sine.inOut',
                    duration: 500,
                    yoyo: true,
                    repeat: 4
                }
            },
            onComplete: function () {
                item.destroy();
            }
        });
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
