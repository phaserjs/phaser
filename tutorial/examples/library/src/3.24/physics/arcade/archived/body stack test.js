var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var text;
var blocks = [];
var mushroom;
var block;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('block', 'assets/sprites/crate32.png');
    this.load.image('block2', 'assets/sprites/crate.png');
    // this.load.image('mushroom', 'assets/sprites/mushroom2.png');
    this.load.image('mushroom', 'assets/sprites/box-item-boxed.png');
}

function create ()
{
    // mushroom = this.physics.add.image(410, 100, 'mushroom').setName('mushroom').setVelocityY(100).setCollideWorldBounds(true);
    // block = this.physics.add.image(400, 170, 'block2').setName('block').setVelocityY(200).setCollideWorldBounds(true);

    // mushroom = this.physics.add.image(410, 400, 'mushroom').setName('mushroom').setVelocityY(100).setCollideWorldBounds(true);
    // block = this.physics.add.image(400, 300, 'block2').setName('block').setVelocityY(120).setCollideWorldBounds(true);

    // mushroom = this.physics.add.image(410, 400, 'mushroom').setName('mushroom').setVelocityY(100).setCollideWorldBounds(true);
    // block = this.physics.add.image(400, 500, 'block2').setName('block').setVelocityY(120).setCollideWorldBounds(true);

    // block = this.physics.add.image(400, 200, 'block2').setName('block').setVelocityY(-120).setCollideWorldBounds(true);
    // mushroom = this.physics.add.image(410, 300, 'mushroom').setName('mushroom').setVelocityY(-100).setCollideWorldBounds(true);

    // mushroom = this.physics.add.image(410, 200, 'mushroom').setName('mushroom').setVelocityY(100).setCollideWorldBounds(true);
    // block = this.physics.add.image(400, 500, 'block2').setName('block').setVelocityY(0).setCollideWorldBounds(true).setImmovable(true);

    // mushroom = this.physics.add.image(410, 500, 'mushroom').setName('mushroom').setVelocityY(-100).setCollideWorldBounds(true);
    // block = this.physics.add.image(400, 200, 'block2').setName('block').setVelocityY(0).setCollideWorldBounds(true).setImmovable(true);

    // mushroom = this.physics.add.image(410, 200, 'mushroom').setName('mushroom').setVelocityY(200).setCollideWorldBounds(true).setBounce(1);
    // block = this.physics.add.image(400, 500, 'block2').setName('block').setVelocityY(0).setCollideWorldBounds(true).setImmovable(true);

    // mushroom = this.physics.add.image(410, 200, 'mushroom').setName('mushroom').setVelocityY(-50).setCollideWorldBounds(true).setImmovable(true);
    // block = this.physics.add.image(400, 500, 'block2').setName('block').setVelocityY(-200).setCollideWorldBounds(true).setImmovable(false);

    // mushroom = this.physics.add.image(410, 300, 'mushroom').setName('mushroom').setVelocityY(-50).setCollideWorldBounds(true).setImmovable(false);
    // block = this.physics.add.image(400, 500, 'block2').setName('block').setVelocityY(-200).setCollideWorldBounds(true).setImmovable(true);

    // mushroom = this.physics.add.image(410, 200, 'mushroom').setName('mushroom').setVelocityY(100).setCollideWorldBounds(true).setImmovable(false);
    // block = this.physics.add.image(400, 300, 'block2').setName('block').setVelocityY(50).setCollideWorldBounds(true).setImmovable(true);

    //  TEST 1
    // mushroom = this.physics.add.image(410, 200, 'mushroom').setName('yellow').setVelocityY(100).setCollideWorldBounds(true).setImmovable(false);
    // block = this.physics.add.image(400, 500, 'block2').setName('block').setVelocityY(100).setCollideWorldBounds(true).setImmovable(false);

    //  TEST 2
    // mushroom = this.physics.add.image(410, 500, 'mushroom').setName('yellow').setVelocityY(-100).setCollideWorldBounds(true).setImmovable(false);
    // block = this.physics.add.image(400, 200, 'block2').setName('block').setVelocityY(-100).setCollideWorldBounds(true).setImmovable(false);

    //  TEST 3
    // mushroom = this.physics.add.image(410, 500, 'mushroom').setName('yellow').setVelocityY(-100).setCollideWorldBounds(true).setImmovable(false);
    // block = this.physics.add.image(400, 200, 'block2').setName('block').setVelocityY(0).setCollideWorldBounds(true).setImmovable(true);

    //  TEST 4
    // block = this.physics.add.image(400, 200, 'block2').setName('block').setVelocityY(-20).setCollideWorldBounds(true).setImmovable(false);
    // mushroom = this.physics.add.image(410, 500, 'mushroom').setName('yellow').setVelocityY(-100).setCollideWorldBounds(true).setImmovable(true);

    //  TEST 5
    // block = this.physics.add.image(400, 200, 'block2').setName('block').setVelocityY(50).setCollideWorldBounds(true).setImmovable(false);
    // mushroom = this.physics.add.image(410, 500, 'mushroom').setName('yellow').setVelocityY(-100).setCollideWorldBounds(true).setImmovable(true);

    //  TEST 6
    block = this.physics.add.image(400, 200, 'block2').setName('block').setVelocityY(50).setCollideWorldBounds(true).setImmovable(true);
    mushroom = this.physics.add.image(410, 500, 'mushroom').setName('yellow').setVelocityY(-100).setCollideWorldBounds(true).setImmovable(false);

    text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });
}

function update (time)
{
    // this.physics.collide(mushroom, block);
    this.physics.collide(block, mushroom);

    // for (var i = 0; i < 10; i++)
    // {
        // this.physics.collide(block, mushroom);
        // this.physics.collide(blocks);
    // }

    // var t = [];

    // blocks.forEach(function(block, i) {

    //     var body = block.body;

    //     t.push(i, 'down: ' + body.blocked.down, 'y: ' + body.y, 'vy: ' + body.velocity.y, 'dy: ' + body._dy, '');
        // t.push(i, 'up: ' + body.blocked.up, 'down: ' + body.blocked.down, 'y: ' + body.y, 'vy: ' + body.velocity.y, 'dy: ' + body._dy, '');

    // });

    // text.setText(t);

    if (Phaser.VERSION === '3.16.2')
    {
        text.setText([
            'mushroom',
            'tup: ' + mushroom.body.touching.up,
            'tdown: ' + mushroom.body.touching.down,
            'up: ' + mushroom.body.blocked.up,
            'down: ' + mushroom.body.blocked.down,
            'y: ' + mushroom.body.y,
            'bot: ' + mushroom.body.bottom,
            'vy: ' + mushroom.body.velocity.y,
            'dy: ' + mushroom.body._dy,
            '',
            'block',
            'tup: ' + block.body.touching.up,
            'tdown: ' + block.body.touching.down,
            'up: ' + block.body.blocked.up,
            'down: ' + block.body.blocked.down,
            'y: ' + block.body.y,
            'bot: ' + block.body.bottom,
            'vy: ' + block.body.velocity.y,
            'dy: ' + block.body._dy
        ]);
    }
    else
    {
        text.setText([
            'mushroom',
            'tup: ' + mushroom.body.touching.up,
            'tdown: ' + mushroom.body.touching.down,
            'wup: ' + mushroom.body.worldBlocked.up,
            'up: ' + mushroom.body.blocked.up,
            'down: ' + mushroom.body.blocked.down,
            'y: ' + mushroom.body.y,
            'bot: ' + mushroom.body.bottom,
            'vy: ' + mushroom.body.velocity.y,
            'dy: ' + mushroom.body._dy,
            '',
            'block',
            'tup: ' + block.body.touching.up,
            'tdown: ' + block.body.touching.down,
            'up: ' + block.body.blocked.up,
            'down: ' + block.body.blocked.down,
            'wdown: ' + block.body.worldBlocked.down,
            'y: ' + block.body.y,
            'bot: ' + block.body.bottom,
            'vy: ' + block.body.velocity.y,
            'dy: ' + block.body._dy
        ]);
    }
}
