class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('coffee', 'assets/sprites/coffee.png');
        this.load.image('donut', 'assets/sprites/donut.png');
    }

    create ()
    {
        this.add.text(10, 10, 'Click Sprite to move between Layer');

        const size1 = this.add.text(10, 48);
        const size2 = this.add.text(410, 48);

        this.add.line(400, 300, 0, 0, 0, 600, 0xffffff);

        const layer = this.add.layer();

        const clickSprite = function ()
        {
            if (this.displayList === layer)
            {
                //  By calling addToDisplayList it will automatically remove
                //  it from the Layer and add it back onto the Display List.
                this.addToDisplayList();

                //  If you want to remove it from the Layer and NOT add it
                //  to the Display List, then call layer.remove(this)

                this.x -= 400;
            }
            else
            {
                //  Move from Display List to Layer
                //  Doing this will automatically remove it from the Display List
                layer.add(this);

                this.x += 400;
            }

            size1.setText('Display List size: ' + this.scene.children.length);
            size2.setText('Layer size: ' + layer.length);
        }

        for (let i = 0; i < 8; i++)
        {
            const x1 = Phaser.Math.Between(64, 336);
            const y1 = Phaser.Math.Between(128, 536);

            const x2 = Phaser.Math.Between(464, 736);
            const y2 = Phaser.Math.Between(128, 536);

            const sprite1 = new Phaser.GameObjects.Sprite(this, x1, y1, 'coffee');
            const sprite2 = new Phaser.GameObjects.Sprite(this, x2, y2, 'donut');

            sprite1.addToDisplayList();

            layer.add(sprite2);

            sprite1.setInteractive();
            sprite2.setInteractive();

            sprite1.on('pointerdown', clickSprite);
            sprite2.on('pointerdown', clickSprite);
        }

        size1.setText('Display List size: ' + this.children.length);
        size2.setText('Layer size: ' + layer.length);
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
