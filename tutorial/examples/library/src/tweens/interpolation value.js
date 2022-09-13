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
        const image1 = this.add.image(100, 100, 'block');
        const image2 = this.add.image(100, 200, 'block');
        const image3 = this.add.image(100, 300, 'block');

        this.tweens.add({
            targets: image1,
            duration: 4000,
            x: [ 100, 300, 200, 600 ]
        });

        this.tweens.add({
            targets: image2,
            duration: 4000,
            x: [ 100, 300, 200, 600 ],
            interpolation: 'bezier'
        });

        this.tweens.add({
            targets: image3,
            duration: 4000,
            x: [ 100, 300, 200, 600 ],
            interpolation: 'catmull'
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
