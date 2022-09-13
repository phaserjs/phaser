class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('cake', 'assets/sprites/strawberry-cake.png');
    }

    create ()
    {
        this.add.text(10, 10, 'Click Sprite to move between Layers');

        const size1 = this.add.text(10, 48);
        const size2 = this.add.text(410, 48);

        this.add.line(400, 300, 0, 0, 0, 600, 0xffffff);

        const layer1 = this.add.layer();
        const layer2 = this.add.layer();

        for (let i = 0; i < 8; i++)
        {
            const x = Phaser.Math.Between(64, 336);
            const y = Phaser.Math.Between(128, 536);

            const sprite = new Phaser.GameObjects.Sprite(this, x, y, 'cake');

            layer1.add(sprite);

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

                size1.setText('Layer 1 size: ' + layer1.length);
                size2.setText('Layer 2 size: ' + layer2.length);

            });
        }

        size1.setText('Layer 1 size: ' + layer1.length);
        size2.setText('Layer 2 size: ' + layer2.length);
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
