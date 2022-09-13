var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('brush', 'assets/particles/sparkle1.png');
    this.load.image('tiles', 'assets/textures/grass.png');
    this.load.image('bg', 'assets/pics/turkey-1985086.jpg');
}

function create ()
{
    this.add.image(0, 0, 'bg').setOrigin(0);

    var rt = this.add.renderTexture(0, 0, 800, 600);

    for (var y = 0; y < 2; y++)
    {
        for (var x = 0; x < 2; x++)
        {
            rt.draw('tiles', x * 512, y * 512);
        }
    }

    var brush = this.make.image({ key: 'brush' }, false).setScale(0.5);

    // var brush = this.add.circle(0, 0, 32, 0xffffff);

    this.input.on('pointermove', function (pointer) {

        if (pointer.isDown)
        {
            rt.erase(brush, pointer.x - 16, pointer.y - 16);
        }

    }, this);

    this.input.on('pointerdown', function (pointer) {

        rt.erase(brush, pointer.x - 16, pointer.y - 16);

    }, this);
}
