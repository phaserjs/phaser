var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            debug: true
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
    this.matter.world.setBounds().disableGravity();

    size = 'block2';

    // var b = this.physics.add.image(400, 300, size).setName('0').setInteractive();
    var b = this.matter.add.image(400, 300, size).setName('0').setInteractive();

    // b.setVelocity(6, 3);
    // b.setBounce(1);
    b.setFriction(0, 0, 0);
    b.setFrictionAir(0.005);

    blocks.push(b);

    this.input.on('pointerdown', function (pointer) {

        var b = this.matter.add.image(pointer.x, pointer.y, size).setName(blocks.length + 1).setInteractive();

        b.setVelocity(0, 8)
        // b.setBounce(1, 1);
        b.setFriction(0, 0, 0);
        b.setFrictionAir(0.005);

        blocks.push(b);

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
}

function update (time)
{
    if (monitor)
    {
        text.setText([
            'size: ' + size,
            'name: ' + monitor.name,
            'up: ' + monitor.body.blocked.up,
            'down: ' + monitor.body.blocked.down,
            'tup: ' + monitor.body.touching.up,
            'tdown: ' + monitor.body.touching.down,
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
