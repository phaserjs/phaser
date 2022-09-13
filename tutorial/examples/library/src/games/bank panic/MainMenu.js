export default class MainMenu extends Phaser.Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(512, 384, 'title');

        let sign = this.add.image(512, -400, 'logo');

        this.tweens.add({
            targets: sign,
            y: 180,
            ease: 'Bounce.easeOut',
            duration: 2000
        });

        let cactus1 = this.add.image(150, 680, 'assets', 'cactus');
        let cactus2 = this.add.image(880, 680, 'assets', 'cactus').setFlipX(true);

        this.tweens.add({
            targets: cactus1,
            props: {
                scaleX: { value: 0.9, duration: 250 },
                scaleY: { value: 1.1, duration: 250 },
                angle: { value: -20, duration: 500, delay: 250 },
                y: { value: 660, duration: 250 }
            },
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: true
        });

        this.tweens.add({
            targets: cactus2,
            props: {
                scaleX: { value: 0.9, duration: 250 },
                scaleY: { value: 1.1, duration: 250 },
                angle: { value: 20, duration: 500, delay: 250 },
                y: { value: 660, duration: 250 }
            },
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: true
        });

        this.music = this.sound.play('music', { loop: true });

        this.input.once('pointerdown', () => {

            this.sound.stopAll();

            this.sound.play('shot');

            this.scene.start('MainGame');

        });
    }
}
