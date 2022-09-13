var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1b1464',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var image;
var cursors;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('block', 'assets/sprites/block.png');
}

function create ()
{
    image = this.matter.add.image(400, 300, 'block');

    this.matter.add.image(700, 200, 'block').setBounce(0.6);
    this.matter.add.image(100, 500, 'block').setBounce(0.6);

    this.matter.world.setBounds(0, 0, 800, 600);

    cursors = this.input.keyboard.createCursorKeys();
}

function update ()
{
    if (cursors.left.isDown)
    {
        image.setVelocityX(-10);
    }
    else if (cursors.right.isDown)
    {
        image.setVelocityX(10);
    }
    else
    {
        image.setVelocityX(0);
    }

    if (cursors.up.isDown)
    {
        image.setVelocityY(-10);
    }
    else if (cursors.down.isDown)
    {
        image.setVelocityY(10);
    }
    else
    {
        image.setVelocityY(0);
    }
}
