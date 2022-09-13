var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
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

var body1;
var body2;
var text;
var monitor = null;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('block', 'assets/sprites/p2.jpg');
    this.load.image('box', 'assets/sprites/steelbox.png');
    this.load.image('bg', 'assets/tests/32pxstrip.png');
}

function create ()
{
    this.add.image(0, 0, 'bg').setOrigin(0);

    //  top test
    body1 = this.physics.add.image(400, 300, 'block').setOrigin(0).setImmovable(true).setName('big');
    body2 = this.physics.add.image(400 - 60, 100, 'box').setOrigin(0).setName('small');
    body2.body.setDirectControl(true);
    var destX = body2.x;
    var destY = 500;

    // player.setVelocity(0, 2000);

    //  left test
    // block = this.physics.add.image(400, 300, 'block').setOrigin(0).setImmovable(true).setName('big');
    // player = this.physics.add.image(80, 300 - 60, 'box').setOrigin(0).setCollideWorldBounds(true).setName('small');
    // player.setVelocity(5000, 0);

    //  right test
    // block = this.physics.add.image(200, 300, 'block').setOrigin(0).setImmovable(true).setName('big');
    // player = this.physics.add.image(700, 300 - 60, 'box').setOrigin(0).setCollideWorldBounds(true).setName('small');
    // player.setVelocity(-1000, 0);

    //  bottom test
    // block = this.physics.add.image(400, 100, 'block').setOrigin(0).setImmovable(true).setName('big');
    // player = this.physics.add.image(400 - 60, 500, 'box').setOrigin(0).setCollideWorldBounds(true).setName('small');
    // player.setVelocity(0, -1000);

    //  edge test
    // block = this.physics.add.image(400, 100, 'block').setOrigin(0).setImmovable(true).setName('big');
    // player = this.physics.add.image(400 - 64 - 100, 100 + 256 + 100, 'box').setOrigin(0).setCollideWorldBounds(true).setName('small');
    // player.setVelocity(500, -500);

    //  edge test 2
    // block = this.physics.add.image(400, 300, 'block').setImmovable(true).setName('big');
    // player = this.physics.add.image(150, 650, 'box').setCollideWorldBounds(true).setName('small');
    // player.setVelocity(1500, -1500);


    // player = this.physics.add.image(300, 650, 'box').setCollideWorldBounds(true).setName('small');
    // player.setVelocity(700, -700);

    // player = this.physics.add.image(400, 70, 'box').setCollideWorldBounds(true).setName('small');
    // player.setVelocity(500, 700);

    // player = this.physics.add.image(420, 550, 'box').setCollideWorldBounds(true).setName('small');
    // player.setVelocity(500, -700);

    monitor = body2;

    text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#000000' });

    this.physics.add.collider(body1, body2);
    // this.physics.add.collider(player, block);

    moveTween = this.tweens.add({
        targets: body2,
        x: destX,
        y: destY,
        duration: 1000,
        ease: 'Linear',
        delay: 1000
    });
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

        var blocked = monitor.body.blocked;
        var touching = monitor.body.touching;
        var worldBlocked = monitor.body.worldBlocked;
        var hardBlocked = monitor.body.hardBlocked;

        text.setText([
            'BLOCKED = None: ' + blocked.none + ' Up: ' + blocked.up + ' Down: ' + blocked.down + ' Left: ' + blocked.left + ' Right: ' + blocked.right,
            'HARD BLOCKED = None: ' + hardBlocked.none + ' Up: ' + hardBlocked.up + ' Down: ' + hardBlocked.down + ' Left: ' + hardBlocked.left + ' Right: ' + hardBlocked.right,
            'WORLD BLOCKED = None: ' + worldBlocked.none + ' Up: ' + worldBlocked.up + ' Down: ' + worldBlocked.down + ' Left: ' + worldBlocked.left + ' Right: ' + worldBlocked.right,
            'TOUCHING = None: ' + touching.none + ' Up: ' + touching.up + ' Down: ' + touching.down + ' Left: ' + touching.left + ' Right: ' + touching.right,
            '',
            'isBlockedX: ' + monitor.body.isBlockedX(),
            'isBlockedY: ' + monitor.body.isBlockedY(),
            'isBlockedUp: ' + monitor.body.isBlockedUp(),
            'isBlockedDown: ' + monitor.body.isBlockedDown(),
            'isBlockedLeft: ' + monitor.body.isBlockedLeft(),
            'isBlockedRight: ' + monitor.body.isBlockedRight(),
            '',
            'sprite x: ' + (mx - mww),
            'sprite y: ' + (my - mhh),
            'sprite right: ' + ((mx - mww) + mw),
            'sprite bottom: ' + ((my - mhh) + mh),
            '',
            'body x: ' + monitor.body.x,
            'body y: ' + monitor.body.y,
            'body right: ' + monitor.body.right,
            'body bottom: ' + monitor.body.bottom,
            '',
            'Velocity X: ' + monitor.body.velocity.x,
            'Velocity Y: ' + monitor.body.velocity.y,
            'Delta X: ' + monitor.body._dx,
            'Delta Y: ' + monitor.body._dy,
            'Speed: ' + monitor.body.speed,
        ]);
    }
}
