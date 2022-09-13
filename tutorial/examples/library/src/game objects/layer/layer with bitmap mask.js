class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('elephant', 'assets/sprites/elephant.png');
        this.load.image('splat', 'assets/pics/splat1.png');
    }

    create ()
    {
        const elephantLayer = this.add.layer();

        const splat = this.make.image({ x: 400, y: 300, key: 'splat' }, false);

        const mask = splat.createBitmapMask();

        elephantLayer.setMask(mask);

        for (let i = 0; i < 64; i++)
        {
            let x = Phaser.Math.Between(600, 800);
            let y = Phaser.Math.Between(0, 600);

            let sprite = elephantLayer.add(this.make.sprite({ x, y, key: 'elephant' }));

            let dx = x - 600;

            this.tweens.add({
                targets: sprite,
                x: dx,
                ease: 'Sine.inOut',
                duration: 4000,
                delay: (i * 50),
                yoyo: true,
                repeat: -1
            });
        }
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
