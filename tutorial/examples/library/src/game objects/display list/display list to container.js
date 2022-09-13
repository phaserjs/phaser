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
        this.add.text(10, 10, 'Click Sprite to move between Container');

        const size1 = this.add.text(10, 48);
        const size2 = this.add.text(410, 48);

        this.add.line(400, 300, 0, 0, 0, 600, 0xffffff);

        const container = this.add.container();

        const clickSprite = function ()
        {
            if (this.parentContainer === container)
            {
                //  Remove from Container, this places it back on the Display List
                container.remove(this);

                this.x -= 400;
            }
            else
            {
                //  Move from Display List to Container
                //  Doing this will automatically remove it from the Display List
                container.add(this);

                this.x += 400;
            }

            size1.setText('Display List size: ' + this.scene.children.length);
            size2.setText('Container size: ' + container.length);
        }

        for (let i = 0; i < 8; i++)
        {
            const x1 = Phaser.Math.Between(64, 336);
            const y1 = Phaser.Math.Between(128, 536);

            const x2 = Phaser.Math.Between(464, 736);
            const y2 = Phaser.Math.Between(128, 536);

            const sprite1 = new Phaser.GameObjects.Sprite(this, x1, y1, 'cake');
            const sprite2 = new Phaser.GameObjects.Sprite(this, x2, y2, 'watermelon');

            sprite1.addToDisplayList();

            container.add(sprite2);

            sprite1.setInteractive();
            sprite2.setInteractive();

            sprite1.on('pointerdown', clickSprite);
            sprite2.on('pointerdown', clickSprite);
        }

        size1.setText('Display List size: ' + this.children.length);
        size2.setText('Container size: ' + container.length);
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
