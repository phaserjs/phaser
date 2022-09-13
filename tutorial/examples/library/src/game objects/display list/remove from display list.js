class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('beer', 'assets/sprites/beer.png');
        this.load.image('watermelon', 'assets/sprites/watermelon.png');
        this.load.image('cake', 'assets/sprites/cake.png');
    }

    create ()
    {
        this.add.text(10, 10, 'Click Sprite to remove it').setDepth(1);

        const size = this.add.text(10, 32, 'Display List size: 34').setDepth(1);

        for (let i = 0; i < 32; i++)
        {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(100, 600);

            const sprite = this.add.sprite(x, y, 'beer');

            sprite.setInteractive();

            sprite.once('pointerdown', () => {

                sprite.removeFromDisplayList();

                size.setText('Display List size: ' + this.children.length);

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
