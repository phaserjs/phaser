class Example extends Phaser.Scene
{
    constructor ()
    {
        super();

        this.move = 0;
    }

    preload ()
    {
        this.load.atlas('atlas', 'assets/tests/fruit/veg.png', 'assets/tests/fruit/veg.json');
        this.load.image('mushroom', 'assets/sprites/mushroom2.png');
    }

    create ()
    {
        const layer = this.add.layer();

        console.log(layer);

        for (let i = 0; i < 1024; i++)
        {
            let x = Phaser.Math.Between(100, 700);
            let y = Phaser.Math.Between(100, 500);
            let f = Phaser.Math.Between(1, 9);

            const image = layer.add(this.make.image({ x, y, key: 'atlas', frame: 'veg0' + f }, false));

            image.depth = image.y;
        }

        this.mushroom0 = layer.add(this.make.image({ x: 400, y: 300, key: 'mushroom' }, false));
        this.mushroom1 = layer.add(this.make.image({ x: 400, y: 300, key: 'mushroom' }, false));
        this.mushroom2 = layer.add(this.make.image({ x: 400, y: 300, key: 'mushroom' }, false));

        this.input.on('pointerdown', () => {

            layer.visible = !layer.visible;

        });
    }

    update ()
    {
        this.mushroom0.x = 400 + Math.cos(this.move) * 200;
        this.mushroom0.y = 300 + Math.sin(this.move) * 200;
        this.mushroom0.depth = this.mushroom0.y + this.mushroom0.height / 2;

        this.mushroom1.x = 400 + Math.sin(-this.move) * 200;
        this.mushroom1.y = 300 + Math.cos(-this.move) * 200;
        this.mushroom1.depth = this.mushroom1.y + this.mushroom1.height / 2;

        this.mushroom2.y = 300 + Math.sin(this.move) * 180;
        this.mushroom2.depth = this.mushroom2.y + this.mushroom2.height / 2;

        this.move += 0.01;
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
