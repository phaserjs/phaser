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
        this.add.image(100, 100, 'block').setAlpha(0.3);

        const image = this.add.image(100, 100, 'block');

        this.text = this.add.text(32, 32);

        this.timeline = this.tweens.timeline({

            tweens: [{
                targets: image,
                x: 600,
                ease: 'Power1',
                duration: 1000
            },
            {
                targets: image,
                y: 500,
                ease: 'Power1',
                duration: 1000
            },
            {
                targets: image,
                x: 100,
                ease: 'Power1',
                duration: 1000
            },
            {
                targets: image,
                y: 100,
                ease: 'Power1',
                duration: 1000
            }]

        });
    }

    update ()
    {
        const data = this.timeline.data;

        this.text.setText([
            'Tween 1 - ' + data[0].calculatedOffset + ' - ' + data[0].progress + ' - ' + data[0].countdown,
            'Tween 2 - ' + data[1].calculatedOffset + ' - ' + data[1].progress + ' - ' + data[1].countdown,
            'Tween 3 - ' + data[2].calculatedOffset + ' - ' + data[2].progress + ' - ' + data[2].countdown,
            'Tween 4 - ' + data[3].calculatedOffset + ' - ' + data[3].progress + ' - ' + data[3].countdown
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
