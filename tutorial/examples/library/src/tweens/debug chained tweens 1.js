class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('block', 'assets/sprites/block.png');
    }

    create ()
    {
        const image = this.add.image(100, 100, 'block');

        this.text = this.add.text(16, 16).setFontSize(16).setColor('#ffffff');

        this.tween = this.tweens.chain([
            {
                targets: image,
                x: 600,
                ease: 'Linear',
                duration: 1000,
                // delay: 1000
            },
            {
                targets: image,
                y: 500,
                ease: 'Linear',
                duration: 500
            },
            {
                targets: image,
                x: 100,
                ease: 'Linear',
                duration: 1000
            },
            {
                targets: image,
                y: 100,
                ease: 'Linear',
                duration: 500
            }
        ]);
    }

    update ()
    {
        const t = this.tween;

        this.text.setText([
            `Duration: ${t.duration}`,
            `Start Delay: ${t.startDelay}`,
            `Elapsed: ${t.elapsed}`,
            `Progress: ${t.progress}`,
            `State: ${t.state}`
        ]);
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
