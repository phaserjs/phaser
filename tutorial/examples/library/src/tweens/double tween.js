class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.script('gsap', 'js/gsap.js');
        this.load.image('block', 'assets/sprites/crate.png');
    }

    create ()
    {
        this.image1 = this.add.image(100, 200, 'block');
        this.image2 = this.add.image(100, 400, 'block');

        this.debug = this.add.graphics();

        this.debug.fillStyle(0xffffff);
        this.debug.fillRect(100-32, 0, 2, 600);
        this.debug.fillRect(700+32, 0, 2, 600);

        this.input.once('pointerdown', () => {

            // let now = performance.now();
            // let start = now;

            // console.log('total duration', 2000 * 5);
            // console.log('eta', start + (2000 * 5));

            this.tweens.add({
                targets: this.image1,
                x: 700,
                // delay: 500,
                // repeat: 4,
                // hold: 500,
                ease: 'linear',
                duration: 1000,
                // onRepeat: () => {
                //     let cur = performance.now();
                //     console.log('Phaser repeat', cur - now);
                //     now = cur;
                // },
                // onComplete: () => {
                //     let cur = performance.now();
                //     console.log('Phaser complete', cur);
                //     console.log('Phaser duration', cur - start);
                // },
            });

            // gsap.to(this.image2, {
            //     x: 700,
            //     // delay: 0.5,
            //     repeat: 2,
            //     // repeatDelay: 0.5,
            //     duration: 1.5,
            //     ease: 'linear',
            //     onComplete: () => {
            //         console.log('GSAP', performance.now());
            //     },
            // });

            // gsap.to(this.image2, {
            //     x: 700,
            //     repeat: 8,
            //     repeatDelay: 0.5,
            //     duration: 0.5,
            //     ease: 'linear',
            //     onComplete: () => {
            //         console.log('GSAP', performance.now());
            //     },
            // });

        });

        // this.tweens.add({
        //     targets: this.image,
        //     y: 50,
        //     // yoyo: true,
        //     ease: 'Linear',
        //     duration: 500,
        //     // delay: 500,
        //     repeat: -1,
        //     repeatDelay: 500
        // });

        // this.tweens.add({
        //     targets: this.image,
        //     y: 550,
        //     // yoyo: true,
        //     ease: 'Linear',
        //     duration: 500,
        //     repeat: -1,
        //     delay: 500,
        //     repeatDelay: 1000
        // });
    }

    update ()
    {
        // this.debug.fillRect(this.image1.x, this.image1.y, 2, 2);
        // this.debug.fillRect(this.image2.x, this.image2.y, 2, 2);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: Example
};

const game = new Phaser.Game(config);
