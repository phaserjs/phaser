var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 1024,
    height: 512,
    render: {
        //  A custom batch size of 1024 quads
        batchSize: 1024
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('mushroom', 'assets/sprites/mushroom16x16.png');
}

function create ()
{
    //  64 x 32 = 2048

    for (var y = 0; y < 32; y++)
    {
        for (var x = 0; x < 64; x++)
        {
            this.add.image(x * 16, y * 16, 'mushroom').setOrigin(0);
        }
    }
}
