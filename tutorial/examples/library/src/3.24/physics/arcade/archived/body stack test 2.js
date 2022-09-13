var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var size;
var text;
var monitor = null;
var blocks = [];

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bar', 'assets/sprites/bluebar.png');
    this.load.image('block', 'assets/sprites/crate32.png');
    this.load.image('block2', 'assets/sprites/crate.png');
    this.load.image('bullet', 'assets/sprites/bullet.png');
    this.load.image('car', 'assets/sprites/car90.png');
}

function create ()
{
    size = 'block2';

    blocks.push(this.physics.add.image(400, 80, size).setName('0').setVelocityY(200).setCollideWorldBounds(true).setBounce(0.5).setInteractive());

    this.input.on('gameobjectdown', function (pointer, gameobject, event) {

        if (monitor)
        {
            monitor.setTint(0xffffff);
        }

        monitor = gameobject;
        monitor.setTint(0xff0000);

        event.stopPropagation();

    }, this);

    this.input.on('pointerdown', function (pointer) {

        blocks.push(this.physics.add.image(pointer.x, pointer.y, size).setName(blocks.length + 1).setVelocityY(-100).setCollideWorldBounds(true).setBounce(0.5).setInteractive());

        if (monitor)
        {
            monitor.setTint(0xffffff);
            monitor = null;
        }

    }, this);

    this.input.keyboard.on('keydown-A', function () {
        size = 'block';
    }, this);

    this.input.keyboard.on('keydown-B', function () {
        size = 'block2';
    }, this);

    this.input.keyboard.on('keydown-C', function () {
        size = 'bar';
    }, this);

    this.input.keyboard.on('keydown-D', function () {
        size = 'bullet';
    }, this);

    this.input.keyboard.on('keydown-E', function () {
        size = 'car';
    }, this);

    text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });

    this.physics.add.collider(blocks, blocks);
}

function update (time)
{
    // for (var i = 0; i < 10; i++)
    // {
        // this.physics.collide(blocks);
    // }

    // this.physics.collide(blocks);

    if (monitor)
    {
        text.setText([
            'size: ' + size,
            'name: ' + monitor.name,
            'up: ' + monitor.body.blocked.up,
            'down: ' + monitor.body.blocked.down,
            'y: ' + monitor.body.y,
            'bot: ' + monitor.body.bottom,
            'vy: ' + monitor.body.velocity.y,
            'dy: ' + monitor.body._dy
        ]);

            // 'by: ' + ((monitor.body.blocked.by !== null) ? monitor.body.blocked.by.gameObject.name : 'none'),
    }
    else
    {
        text.setText('size: ' + size);
    }
}
