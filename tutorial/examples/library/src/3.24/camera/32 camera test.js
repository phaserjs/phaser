var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var image;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('einstein', 'assets/pics/ra-einstein.png');
}

function create ()
{
    image = this.add.image(100, 70, 'einstein');

    //  We're going to create 32 cameras in a 8x4 grid, making each 100x150 in size

    this.cameras.main.setSize(100, 150);

    for (var y = 0; y < 4; y++)
    {
        for (var x = 0; x < 8; x++)
        {
            if (x === 0 && y === 0)
            {
                continue;
            }

            this.cameras.add(x * 100, y * 150, 100, 150);
        }
    }
}

function update ()
{
    image.rotation += 0.01;
}
