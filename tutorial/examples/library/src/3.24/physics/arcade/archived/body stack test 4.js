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
    this.load.image('mushroom', 'assets/sprites/mushroom2.png');
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

    mushroom = this.physics.add.image(200, 300, 'mushroom').setName('mushroom').setVelocityX(200).setCollideWorldBounds(true);
    block = this.physics.add.image(500, 310, 'block2').setName('block').setVelocityX(-50).setCollideWorldBounds(true).setImmovable(true);

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

    text.setText([
        'mushroom',
        'tup: ' + mushroom.body.touching.left,
        'tright: ' + mushroom.body.touching.right,
        'wleft: ' + mushroom.body.worldBlocked.left,
        'left: ' + mushroom.body.blocked.left,
        'right: ' + mushroom.body.blocked.right,
        'x: ' + mushroom.body.x,
        'right: ' + mushroom.body.right,
        'vx: ' + mushroom.body.velocity.x,
        'dx: ' + mushroom.body._dx,
        '',
        'block',
        'tleft: ' + block.body.touching.left,
        'tright: ' + block.body.touching.right,
        'left: ' + block.body.blocked.left,
        'right: ' + block.body.blocked.right,
        'wright: ' + block.body.worldBlocked.right,
        'x: ' + block.body.x,
        'right: ' + block.body.right,
        'vx: ' + block.body.velocity.x,
        'dx: ' + block.body._dx
    ]);
}
