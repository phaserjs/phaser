var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var bubble;
var dude;
var rt;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bubble', 'assets/particles/bubble.png');
    this.load.image('dude', 'assets/sprites/phaser-dude.png');
}

function create ()
{
    bubble = this.add.image(0, 0, 'bubble');
    dude = this.add.image(0, 0, 'dude');

    rt = this.add.renderTexture(0, 0, 800, 600);

    // rt.fill(0x00ff00, 100, 100);

    // rt.draw(bubble, 32, 32);
    // rt.draw(dude, 32, 32);
}

function update ()
{
    rt.clear();

    for (var i = 0; i < 32; i++)
    {
        var x = Phaser.Math.Between(100, 700);
        var y = Phaser.Math.Between(100, 500);

        rt.draw(bubble, x, y);
    }


    // rt.fill(0x00ff00);

    // rt.draw(bubble, 32, 32);
    // rt.draw(dude, 32, 32);
}
