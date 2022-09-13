class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('einstein', 'assets/pics/ra-einstein.png');
    }

    create ()
    {
        this.image = this.add.image(100, 70, 'einstein');

        //  We're going to create 32 cameras in a 8x4 grid, making each 100x150 in size
        this.cameras.main.setSize(100, 150);

        for (let y = 0; y < 4; y++)
        {
            for (let x = 0; x < 8; x++)
            {
                if (x === 0 && y === 0)
                {
                    continue;
                }
                this.cameras.add(x * 100, y * 150, 100, 150);
            }
        }
    }

    update ()
    {
        this.image.rotation += 0.01;
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene:[ Example ]
};

const game = new Phaser.Game(config);
