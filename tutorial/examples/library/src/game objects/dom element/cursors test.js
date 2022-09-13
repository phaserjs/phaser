var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    backgroundColor: '#0072bc',
    width: 800,
    height: 600,
    dom: {
        createContainer: true
    },
   physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var cursors;
var player;
var element;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('block', 'assets/sprites/block.png');
}

function create ()
{
    cursors = this.input.keyboard.createCursorKeys();
    element = this.add.dom(400, 300, 'div', 'font-size: 96px', '💩').setOrigin(0);

    this.physics.add.existing(element, false);

    element.body.setCollideWorldBounds(true);
}

function update ()
{
    element.body.setVelocity(0);

    if (cursors.left.isDown)
    {
        element.body.setVelocityX(-300);
    }
    else if (cursors.right.isDown)
    {
        element.body.setVelocityX(300);
    }

    if (cursors.up.isDown)
    {
        element.body.setVelocityY(-300);
    }
    else if (cursors.down.isDown)
    {
        element.body.setVelocityY(300);
    }
}
