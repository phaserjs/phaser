var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    backgroundColor: '#0072bc',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var cursors;
var player;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('block', 'assets/sprites/block.png');
}

function create ()
{
    cursors = this.input.keyboard.createCursorKeys();

    player = this.add.image(400, 300, 'block');
}

function update ()
{
    //  Horizontal movement every 250ms
    if (this.input.keyboard.checkDown(cursors.left, 250))
    {
        player.x -= 32;
    }
    else if (this.input.keyboard.checkDown(cursors.right, 250))
    {
        player.x += 32;
    }

    //  Vertical movement every 150ms
    if (this.input.keyboard.checkDown(cursors.up, 150))
    {
        player.y -= 32;
    }
    else if (this.input.keyboard.checkDown(cursors.down, 150))
    {
        player.y += 32;
    }
}