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
    this.load.image('einstein', 'assets/pics/monika-krawinkel-amberstar-title.png');
}

function create ()
{
    image = this.add.image(100, 70, 'einstein');

    //  We're going to create 32 cameras in a 8x4 grid, making each 100x150 in size

    this.cameras.main.setSize(100, 150);
    this.cameras.main.name = 'Cam0';

    var i = 1;

    for (var y = 0; y < 4; y++)
    {
        for (var x = 0; x < 8; x++)
        {
            if (x === 0 && y === 0)
            {
                continue;
            }

            var tx = x * 100;
            var ty = y * 150;

            this.cameras.add(tx, ty, 100, 150, false, 'Cam' + i);

            i++;

        }
    }

    this.input.on('pointerup', function (pointer) {

        var x = Phaser.Math.Snap.Floor(pointer.x, 100);
        var y = Phaser.Math.Snap.Floor(pointer.y, 150);

        var total = this.cameras.remove(pointer.camera);

        if (total === 0)
        {
            var newCam = this.cameras.add(x, y, 100, 150);
            console.log('Added Camera ID', newCam.id);
        }
        else
        {
            console.log('Removed Camera ID', pointer.camera.id);
        }

    }, this);
}

function update ()
{
    image.rotation += 0.01;
}
