var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var bunny;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bunny', 'assets/sprites/bunny.png');
}

function create ()
{
    bunny = this.add.sprite(-150, 300, 'bunny');
}

function update ()
{
    bunny.x += 2;

    if (bunny.x > 950)
    {
        bunny.x = -150;
    }
}
