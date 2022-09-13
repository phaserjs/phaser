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

    //  We're going to create 32 cameras in a 8x4 grid each time you click, making each 100x150 in size

    this.cameras.main.setSize(100, 150);

    var x = 100;
    var y = 0;

    this.input.on('pointerup', function () {

        if (this.cameras.getTotal() < 32)
        {
            this.cameras.add(x, y, 100, 150);

            x += 100;

            if (x === 800)
            {
                x = 0;
                y += 150;
            }
        }

    }, this);
}

function update ()
{
    image.rotation += 0.01;
}
