var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 640,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 100 }
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
var stop = false;
var scene;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('16x16', 'assets/sprites/16x16.png');
    this.load.image('bit0', 'assets/sprites/1bitblock0.png');
    this.load.image('bita', 'assets/sprites/1bitblock1.png');
    this.load.image('bitb', 'assets/sprites/1bitblock2.png');
    this.load.image('bitc', 'assets/sprites/1bitblock3.png');
    this.load.image('bar', 'assets/sprites/bluebar.png');
    this.load.image('smallblock', 'assets/sprites/crate32.png');
    this.load.image('block', 'assets/sprites/crate.png');
    this.load.image('bullet', 'assets/sprites/bullet.png');
    this.load.image('car', 'assets/sprites/car90.png');
    this.load.image('tall', 'assets/sprites/flectrum.png');
    this.load.image('platform', 'assets/sprites/platform.png');
    this.load.image('vu', 'assets/sprites/vu.png');
    this.load.image('bg', 'assets/tests/32pxstrip.png');
}

function create ()
{
    this.add.image(0, 0, 'bg').setOrigin(0);

    var setImmovable = false;

    // size = '16x16';
    // size = 'block';
    // size = 'bit0';
    size = 'bullet';

    var ghost = this.add.image(0, 0, size).setAlpha(0.5).setDepth(1000).setOrigin(0);

    window.scene = this;

    var createBody = function (p)
    {
        var x = p.x;
        var y = p.y;

        var b = scene.physics.add.image(x, y, size).setName(size + blocks.length).setInteractive();

        b.setOrigin(0);
        // b.setVelocityY(Phaser.Math.Between(150,300));
        b.setCollideWorldBounds(true);
        // b.setImmovable(setImmovable);
        b.setBounce(0.5);

        blocks.push(b);

        if (monitor)
        {
            monitor.setTint(0xffffff);
        }

        monitor = b;
        b.setTint(0x00ff00);

        return b;
    };

    // var blockA = createBody({ x: 400, y: 500 }).setVelocityY(50);
    // var blockB = createBody({ x: 410, y: 300 }).setVelocityY(0);
    // var blockB = createBody({ x: 390, y: 200 }).setVelocityY(50);

    createBody({ x: 400, y: 500 }).setVelocityY(50);
    createBody({ x: 400, y: 480 }).setVelocityY(0);
    createBody({ x: 400, y: 450 }).setVelocityY(100);
    createBody({ x: 400, y: 300 }).setVelocityY(200);
    createBody({ x: 400, y: 350 }).setVelocityY(170);


    // size = 'vu';

    ghost.setTexture('bullet');

    // var blockB = createBody({ x: 400, y: 200 }).setVelocityY(100);


    this.input.on('gameobjectdown', function (pointer, gameobject, event) {

        if (monitor)
        {
            monitor.setTint(0xffffff);
        }

        monitor = gameobject;
        monitor.setTint(0x00ff00);

        event.stopPropagation();

    }, this);

    this.input.on('pointermove', function (pointer) {

        ghost.x = pointer.x;
        ghost.y = pointer.y;

    });

    this.input.on('pointerdown', createBody, this);

    this.input.keyboard.on('keydown-A', function () {
        size = 'bita';
        ghost.setTexture(size);
    }, this);

    this.input.keyboard.on('keydown-B', function () {
        size = 'smallblock';
        ghost.setTexture(size);
    }, this);

    this.input.keyboard.on('keydown-C', function () {
        size = 'bitb';
        ghost.setTexture(size);
    }, this);

    this.input.keyboard.on('keydown-D', function () {
        size = 'bullet';
        ghost.setTexture(size);
    }, this);

    this.input.keyboard.on('keydown-E', function () {
        size = 'car';
        ghost.setTexture(size);
    }, this);

    this.input.keyboard.on('keydown-F', function () {
        size = 'tall';
        ghost.setTexture(size);
    }, this);

    this.input.keyboard.on('keydown-G', function () {
        size = 'platform';
        ghost.setTexture(size);
    }, this);

    this.input.keyboard.on('keydown-H', function () {
        size = 'vu';
        ghost.setTexture(size);
    }, this);

    this.input.keyboard.on('keydown-I', function () {
        setImmovable = (setImmovable) ? false: true;
        console.log('setImmovable', setImmovable);
    }, this);

    this.input.keyboard.on('keydown-J', function () {
        size = 'bitc';
        ghost.setTexture(size);
    }, this);

    this.input.keyboard.on('keydown-K', function () {
        size = '16x16';
        ghost.setTexture(size);
    }, this);

    this.input.keyboard.on('keydown-SPACE', function () {
        console.log('stop');
        this.physics.world.isPaused = true;
        stop = true;
    }, this);

    this.input.keyboard.on('keydown-UP', function () {
        monitor.setVelocityY(-800);
    }, this);

    this.input.keyboard.on('keydown-DOWN', function () {
        if (monitor)
        {
            monitor.setTint(0xffffff);
        }
    }, this);

    text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#000000' });

    if (Phaser.VERSION !== '3.17.0')
    {
        this.physics.add.collider(blocks, blocks);
    }
    // this.physics.add.collider(blocks, blocks);
}

function update (time)
{
    if (Phaser.VERSION === '3.17.0')
    {
        if (monitor)
        {
            var my = monitor.y;
            var mh = monitor.height;
            var mhh = mh / 2;

            mhh = 0; // origin 0

            var blocked = monitor.body.blocked;
            var touching = monitor.body.touching;
            var worldBlocked = monitor.body.worldBlocked;
            var hardBlocked = monitor.body.hardBlocked;

            text.setText([
                'texture: ' + size,
                'world gravity: ' + this.physics.world.gravity.y,
                '',
                'name: ' + monitor.name,
                '',
                'BLOCKED = None: ' + blocked.none + ' Up: ' + blocked.up + ' Down: ' + blocked.down,
                'HARD BLOCKED = None: ' + hardBlocked.none + ' Up: ' + hardBlocked.up + ' Down: ' + hardBlocked.down,
                'WORLD BLOCKED = None: ' + worldBlocked.none + ' Up: ' + worldBlocked.up + ' Down: ' + worldBlocked.down,
                'TOUCHING = None: ' + touching.none + ' Up: ' + touching.up + ' Down: ' + touching.down,
                '',
                'isBlockedY: ' + monitor.body.isBlockedY(),
                'isBlockedUp: ' + monitor.body.isBlockedUp(),
                'isBlockedDown: ' + monitor.body.isBlockedDown(),
                '',
                'sprite y: ' + (my - mhh),
                'sprite bottom: ' + ((my - mhh) + mh),
                '',
                'body y: ' + monitor.body.y,
                'body bottom: ' + monitor.body.bottom,
                '',
                'Velocity Y: ' + monitor.body.velocity.y,
                'Delta Y: ' + monitor.body._dy,
                'Speed: ' + monitor.body.speed,
                '',
                '_sleep: ' + monitor.body._sleep,
                'sleeping: ' + monitor.body.sleeping
            ]);
        }
        else
        {
            text.setText('size: ' + size);
        }
    }
    else
    {
        if (monitor)
        {
            text.setText([
                'size: ' + size,
                '',
                'name: ' + monitor.name,
                'BLOCKED = Up: ' + monitor.body.blocked.up,
                'down: ' + monitor.body.blocked.down,
                'tup: ' + monitor.body.touching.up,
                'tdown: ' + monitor.body.touching.down,
                'gy: ' + monitor.y,
                'gbot: ' + (monitor.y - (monitor.height / 2) + monitor.height),
                'y: ' + monitor.body.y,
                'bot: ' + monitor.body.bottom,
                'vy: ' + monitor.body.velocity.y,
                'dy: ' + monitor.body._dy,
                'speed: ' + monitor.body.speed
            ]);
        }
        else
        {
            text.setText('size: ' + size);
        }
    }

    if (stop)
    {
        return;
    }

    if (Phaser.VERSION === '3.17.0')
    {
        this.physics.collide(blocks);
    }

}
