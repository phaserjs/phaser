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
    image = this.add.image(200, 150, 'einstein');

    //  We're going to create 16 cameras in a 4x4 grid, making each 200x150 in size

    this.cameras.main.setSize(200, 150);

    for (var y = 0; y < 4; y++)
    {
        for (var x = 0; x < 4; x++)
        {
            if (x === 0 && y === 0)
            {
                continue;
            }

            this.cameras.add(x * 200, y * 150, 200, 150);
        }
    }
}

function update ()
{
    image.rotation += 0.01;
}
