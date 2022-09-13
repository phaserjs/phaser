var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1b1464',
    parent: 'phaser-example',
    physics: {
        default: 'matter'
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var block;
var cursors;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('block', 'assets/sprites/block.png');
    this.load.image('ball', 'assets/sprites/shinyball.png');
}

function create ()
{
    block = this.matter.add.image(400, 50, 'block', null, { ignoreGravity: true });
    block.setFixedRotation();
    block.setMass(500);

    var y = 150;
    var prev = block;

    for (var i = 0; i < 12; i++)
    {
        var ball = this.matter.add.image(400, y, 'ball', null, { shape: 'circle', mass: 0.1 });

        this.matter.add.joint(prev, ball, (i === 0) ? 90 : 35, 0.4);

        prev = ball;

        y += 18;
    }

    this.matter.add.mouseSpring();

    cursors = this.input.keyboard.createCursorKeys();
}

function update ()
{
    if (cursors.left.isDown)
    {
        block.setVelocityX(-20);
    }
    else if (cursors.right.isDown)
    {
        block.setVelocityX(20);
    }
    else
    {
        block.setVelocityX(0);
    }

    if (cursors.up.isDown)
    {
        block.setVelocityY(-20);
    }
    else if (cursors.down.isDown)
    {
        block.setVelocityY(20);
    }
    else
    {
        block.setVelocityY(0);
    }
}
