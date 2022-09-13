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
        const image = this.add.image(100, 300, 'block');

        this.tweens.add({
            targets: image,
            loop: 4,
            x: { value: 700, duration: 2000, ease: 'Sine.easeInOut', yoyo: true },
            y: { value: 100, duration: 1000, ease: 'Sine.easeOut' }
        });
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
