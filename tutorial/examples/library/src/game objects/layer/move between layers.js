// #module

import HueRotatePostFX from './assets/pipelines/HueRotatePostFX.js';

class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('gem', 'assets/sprites/gem.png');
    }

    create ()
    {
        const layer1 = this.add.layer();
        const layer2 = this.add.layer();

        layer2.setPostPipeline(HueRotatePostFX);

        for (let i = 0; i < 32; i++)
        {
            let x = Phaser.Math.Between(50, 350);
            let y = Phaser.Math.Between(80, 540);

            let sprite = layer1.add(this.make.sprite({ x, y, key: 'gem' }));

            sprite.setInteractive();

            sprite.on('pointerdown', () => {

                if (sprite.displayList === layer1)
                {
                    layer2.add(sprite);

                    sprite.x += 400;
                }
                else
                {
                    layer1.add(sprite);

                    sprite.x -= 400;
                }

            });
        }

        this.add.text(10, 10, 'Click Gems to swap Layer');
        this.add.text(10, 580, '--- Layer 1 --------------------------');
        this.add.text(410, 580, '--- Layer 2 --------------------------');
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: Example,
    pipeline: { HueRotatePostFX }
};

const game = new Phaser.Game(config);
