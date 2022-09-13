export default class MainMenu extends Phaser.Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.sound.play('music', { loop: true, delay: 2 });

        this.add.shader('snow', 512, 384, 1024, 768);

        //  Intro snowball fight

        let ball1 = this.add.image(-64, 300, 'sprites', 'snowball1');
        let ball2 = this.add.image(1088, 360, 'sprites', 'snowball1');
        let ball3 = this.add.image(-64, 320, 'sprites', 'snowball1');
        let logo = this.add.image(1700, 384, 'title');

        this.tweens.add({
            targets: ball1,
            x: 1088,
            y: 360,
            ease: 'cubic.out',
            duration: 600,
            onStart: () => {
                this.sound.play('throw');
            }
        });

        this.tweens.add({
            targets: ball2,
            x: -64,
            y: 280,
            ease: 'cubic.out',
            delay: 700,
            duration: 600,
            onStart: () => {
                this.sound.play('throw');
            }
        });

        this.tweens.add({
            targets: ball3,
            x: 1088,
            y: 380,
            ease: 'cubic.out',
            delay: 1200,
            duration: 600,
            onStart: () => {
                this.sound.play('throw');
            }
        });

        this.tweens.add({
            targets: logo,
            x: 512,
            ease: 'back.out',
            delay: 1800,
            duration: 600,
            onStart: () => {
                this.sound.play('throw');
            }
        });

        this.input.keyboard.once('keydown-SPACE', () => {

            this.scene.start('MainGame');

        }, this);

        this.input.once('pointerdown', () => {

            this.scene.start('MainGame');

        });
    }
}
