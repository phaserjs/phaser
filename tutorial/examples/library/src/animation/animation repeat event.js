class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('poo', 'assets/sprites/poo.png');
        this.load.spritesheet('mummy', 'assets/animations/mummy37x45.png', { frameWidth: 37, frameHeight: 45 });
    }

    create ()
    {
        const mummyAnimation = this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('mummy'),
            frameRate: 16
        });

        const sprite = this.add.sprite(50, 300, 'mummy').setScale(4);

        sprite.play({ key: 'walk', repeat: 7 });

        this.tweens.add({
            targets: sprite,
            x: 750,
            duration: 8800,
            ease: 'Linear'
        });

        sprite.on('animationrepeat', function () {

            const poop = this.add.image(sprite.x - 32, 300, 'poo').setScale(0.5);

            this.tweens.add({
                targets: poop,
                props: {
                    x: {
                        value: '-=64', ease: 'Power1'
                    },
                    y: {
                        value: '+=50', ease: 'Bounce.easeOut'
                    }
                },
                duration: 750
            });

        }, this);
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    pixelArt: true,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
