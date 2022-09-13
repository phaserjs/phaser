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
        this.add.text(10, 10, 'Click to add a Sprite').setDepth(1);

        const size = this.add.text(10, 32, 'Display List size: 2').setDepth(1);

        this.input.on('pointerdown', pointer => {

            const x = pointer.worldX;
            const y = pointer.worldY;

            const sprite = new Phaser.GameObjects.Sprite(this, x, y, 'watermelon');

            sprite.addToDisplayList();

            size.setText('Display List size: ' + this.children.length);

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
