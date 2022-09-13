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

        this.add.image(576, 472, 'tiles', 27).setOrigin(0);
        this.add.image(576, 408, 'tiles', 27).setOrigin(0);
        this.add.image(576, 344, 'tiles', 57).setOrigin(0);

        this.add.text(400, 8, 'Click to repeat animation', { color: '#ffffff' }).setOrigin(0.5, 0);

        //  Our attack animation
        const attackConfig = {
            key: 'attack',
            frames: this.anims.generateFrameNames('knight', { prefix: 'attack_C/frame', start: 0, end: 13, zeroPad: 4 }),
            frameRate: 16,
            repeat: -1
        };

        this.anims.create(attackConfig);

        //  Our coin animation
        const coinConfig = {
            key: 'coin',
            frames: this.anims.generateFrameNumbers('tiles', { start: 42, end: 47 }),
            frameRate: 12,
            repeat: -1
        };

        this.anims.create(coinConfig);

        const lancelot = this.add.sprite(300, 536, 'knight', 'attack_C/frame0000')

        lancelot.setOrigin(0.5, 1);
        lancelot.setScale(8);

        //  Event handler for when the animation completes on our sprite
        lancelot.on(Phaser.Animations.Events.ANIMATION_REPEAT, function () {

            this.releaseItem();

        }, this);

        //  And a click handler to start the animation playing
        this.input.once('pointerdown', function () {

            lancelot.play('attack');

        });
    }

    releaseItem ()
    {
        const item = this.add.sprite(600, 370).play('coin');

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
