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
        this.load.image('image', 'assets/sprites/mushroom2.png');
    }

    create ()
    {
        for (let i = 0; i < 2000; i++)
        {
            const image = this.add.image(100 + Math.random() * 600, 100 + Math.random() * 400, 'atlas', 'veg0' + Math.floor(1 + Math.random() * 9));
            image.depth = image.y;
        }

        this.mushroom0 = this.add.image(400, 300, 'image');
        this.mushroom1 = this.add.image(400, 300, 'image');
        this.mushroom2 = this.add.image(400, 300, 'image');
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
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
