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

var text;
var monitor = null;
var stop = false;
var scene;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bg', 'assets/tests/32pxstrip.png');
}

function create ()
{
    this.add.image(0, 0, 'bg').setOrigin(0);

    var setImmovable = false;

    window.scene = this;

    var createBody = function (p)
    {
        var x = p.x;
        var y = p.y;
        var width = Phaser.Math.Between(64, 256);
        var height = Phaser.Math.Between(64, 256);

        var b = scene.physics.add.body(x, y, width, height);

        b.setCollideWorldBounds(true);
        b.setBounce(1);
        b.setVelocity(200, -100);

        monitor = b;

        return b;
    };

    createBody({ x: 200, y: 200 });

    this.input.on('pointerdown', createBody, this);

    this.input.keyboard.on('keydown-I', function () {
        setImmovable = (setImmovable) ? false: true;
        console.log('setImmovable', setImmovable);
    }, this);

    this.input.keyboard.on('keydown-SPACE', function () {
        this.physics.world.isPaused = true;
        stop = true;
    }, this);

    text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#000000' });

    cursors = this.input.keyboard.createCursorKeys();
}

function update (time)
{
    if (monitor)
    {
        var mx = monitor.x;
        var my = monitor.y;
        var mh = monitor.height;
        var mw = monitor.width;
        var mww = mw / 2;
        var mhh = mh / 2;

        mhh = 0; // origin 0

        var blocked = monitor.blocked;
        var touching = monitor.touching;
        var worldBlocked = monitor.worldBlocked;
        var hardBlocked = monitor.hardBlocked;

        text.setText([
            'world gravity: ' + this.physics.world.gravity.y,
            '',
            'BLOCKED = None: ' + blocked.none + ' Up: ' + blocked.up + ' Down: ' + blocked.down + ' Left: ' + blocked.left + ' Right: ' + blocked.right,
            'HARD BLOCKED = None: ' + hardBlocked.none + ' Up: ' + hardBlocked.up + ' Down: ' + hardBlocked.down + ' Left: ' + hardBlocked.left + ' Right: ' + hardBlocked.right,
            'WORLD BLOCKED = None: ' + worldBlocked.none + ' Up: ' + worldBlocked.up + ' Down: ' + worldBlocked.down + ' Left: ' + worldBlocked.left + ' Right: ' + worldBlocked.right,
            'TOUCHING = None: ' + touching.none + ' Up: ' + touching.up + ' Down: ' + touching.down + ' Left: ' + touching.left + ' Right: ' + touching.right,
            '',
            'isBlockedX: ' + monitor.isBlockedX(),
            'isBlockedY: ' + monitor.isBlockedY(),
            'isBlockedUp: ' + monitor.isBlockedUp(),
            'isBlockedDown: ' + monitor.isBlockedDown(),
            'isBlockedLeft: ' + monitor.isBlockedLeft(),
            'isBlockedRight: ' + monitor.isBlockedRight(),
            '',
            'sprite x: ' + (mx - mww),
            'sprite y: ' + (my - mhh),
            'sprite right: ' + ((mx - mww) + mw),
            'sprite bottom: ' + ((my - mhh) + mh),
            '',
            'body x: ' + monitor.x,
            'body y: ' + monitor.y,
            'body right: ' + monitor.right,
            'body bottom: ' + monitor.bottom,
            '',
            'Velocity X: ' + monitor.velocity.x,
            'Velocity Y: ' + monitor.velocity.y,
            'Delta X: ' + monitor._dx,
            'Delta Y: ' + monitor._dy,
            'Speed: ' + monitor.speed,
            '',
            '_sleep: ' + monitor._sleep,
            '_sleepX: ' + monitor._sleepX,
            '_sleepY: ' + monitor._sleepY,
            'sleeping: ' + monitor.sleeping
        ]);
    }

    if (stop)
    {
        return;
    }

    // this.physics.collide(blocks);
}
