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
        this.add.text(10, 10, 'Click to add Sprite to Container').setDepth(1);

        const size = this.add.text(10, 32, 'Container size: 0').setDepth(1);

        const container = this.add.container();

        this.input.on('pointerdown', pointer => {

            const x = pointer.worldX;
            const y = pointer.worldY;

            const sprite = new Phaser.GameObjects.Sprite(this, x, y, 'cake');

            container.add(sprite);

            size.setText('Container size: ' + container.length);

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
