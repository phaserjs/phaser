class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('cake', 'assets/sprites/cake.png');
    }

    create ()
    {
        this.add.text(10, 10, 'Click Sprite to move between Containers');

        const size1 = this.add.text(10, 48);
        const size2 = this.add.text(410, 48);

        this.add.line(400, 300, 0, 0, 0, 600, 0xffffff);

        const container1 = this.add.container();
        const container2 = this.add.container();

        for (let i = 0; i < 8; i++)
        {
            const x = Phaser.Math.Between(64, 336);
            const y = Phaser.Math.Between(128, 536);

            const sprite = new Phaser.GameObjects.Sprite(this, x, y, 'cake');

            container1.add(sprite);

            sprite.setInteractive();

            sprite.on('pointerdown', () => {

                if (sprite.parentContainer === container1)
                {
                    container2.add(sprite);

                    sprite.x += 400;
                }
                else
                {
                    container1.add(sprite);

                    sprite.x -= 400;
                }

                size1.setText('Container 1 size: ' + container1.length);
                size2.setText('Container 2 size: ' + container2.length);

            });
        }

        size1.setText('Container 1 size: ' + container1.length);
        size2.setText('Container 2 size: ' + container2.length);
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
