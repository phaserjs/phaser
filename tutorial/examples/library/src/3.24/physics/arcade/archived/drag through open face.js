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
var debug;
var monitor = null;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('block', 'assets/sprites/p2.jpg');
    this.load.image('box', 'assets/sprites/steelbox.png');
    this.load.image('chunk', 'assets/sprites/chunk.png');
    this.load.image('bg', 'assets/tests/32pxstrip.png');
}

function create ()
{
    this.add.image(0, 0, 'bg').setOrigin(0);

    var block = this.physics.add.image(400, 300, 'block').setImmovable(true).setName('big');

    //  Allow entrance through the top-face only
    // block.body.setCheckCollisionUp(false);
    // block.body.setCheckCollisionDown(false);

    // var block2 = this.physics.add.image(700, 500, 'box').setImmovable(true);
    // var block3 = this.physics.add.image(200, 500, 'chunk').setImmovable(true);

    var player = this.physics.add.image(100, 100, 'box').setCollideWorldBounds(true).setName('small');

    player.body.setDirectControl(true);

    this.input.setDraggable(player.setInteractive());

    this.input.on('drag', function (pointer, obj, dragX, dragY)
    {
        // obj.body.setDirectPosition(dragX - 32, dragY - 32);

        // obj.x = dragX;
        // obj.y = dragY;

        obj.body.directX = dragX;
        obj.body.directY = dragY;
    });
   
    /*
    this.tweens.add({
        targets: player.body,
        cx: 300,
        cy: 500,
        ease: 'Sine.easeInOut',
        duration: 5000,
        yoyo: true,
        repeat: -1
    });
    */

    monitor = player;

    text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#000000' });

    this.physics.add.collider(player, block);
    // this.physics.add.collider(block, player);

    body1 = block;
    body2 = player;

    // this.physics.add.collider(player, [ block, block2, block3 ]);
    // 

    debug = this.add.graphics();
}

function update (time)
{
    if (window.ci)
    {
        var ci = window.ci;
        var faces = { 10: 'None', 11: 'Up', 12: 'Down', 13: 'Left', 14: 'Right' };
        var dir = { 0: 'Right', 1: 'Down', 2: 'Left', 3: 'Up' };

        var body1Size = Phaser.Geom.Rectangle.Area(body1.body);
        var body2Size = Phaser.Geom.Rectangle.Area(body2.body);
        var overlapSize = Phaser.Geom.Rectangle.Area(ci.area);

        var p1 = Phaser.Math.Percent(overlapSize, 0, body1Size);
        var p2 = Phaser.Math.Percent(overlapSize, 0, body2Size);

        var blocked = body2.body.blocked;
        var touching = body2.body.touching;
        var worldBlocked = body2.body.worldBlocked;
        var hardBlocked = body2.body.hardBlocked;

        text.setText([
            'BLOCKED = None: ' + blocked.none + ' Up: ' + blocked.up + ' Down: ' + blocked.down + ' Left: ' + blocked.left + ' Right: ' + blocked.right,
            'HARD BLOCKED = None: ' + hardBlocked.none + ' Up: ' + hardBlocked.up + ' Down: ' + hardBlocked.down + ' Left: ' + hardBlocked.left + ' Right: ' + hardBlocked.right,
            'WORLD BLOCKED = None: ' + worldBlocked.none + ' Up: ' + worldBlocked.up + ' Down: ' + worldBlocked.down + ' Left: ' + worldBlocked.left + ' Right: ' + worldBlocked.right,
            'TOUCHING = None: ' + touching.none + ' Up: ' + touching.up + ' Down: ' + touching.down + ' Left: ' + touching.left + ' Right: ' + touching.right,
            '',
            'Velocity X: ' + body2.body.velocity.x,
            'Velocity Y: ' + body2.body.velocity.y,
            'Delta X: ' + body2.body._dx,
            'Delta Y: ' + body2.body._dy,
            'Angle: ' + body2.body.angle,
            'Speed: ' + body2.body.speed,
            '',
            'body1Size: ' + body1Size,
            'body2Size: ' + body2Size,
            'overlapSize: ' + overlapSize,
            'p1%: ' + p1,
            'p2%: ' + p2,
            // 'forceX: ' + ci.forceX,
            // 'intersects: ' + ci.intersects,
            // 'touching: ' + ci.touching,
            // 'intersectsX: ' + ci.intersectsX,
            // 'intersectsY: ' + ci.intersectsY,
            // 'embeddedX: ' + ci.embeddedX,
            // 'embeddedY: ' + ci.embeddedY,
            // 'timeXCollision: ' + ci.timeXCollision,
            // 'timeYCollision: ' + ci.timeYCollision,
            'overlapX: ' + ci.overlapX,
            'overlapY: ' + ci.overlapY,
            'face: ' + faces[ci.face],
            'faceX: ' + faces[ci.faceX],
            'faceY: ' + faces[ci.faceY],
            '',
            'angle: ' + dir[ci.moving1],
            '',
            '_sleep: ' + body2.body._sleep,
            'sleeping: ' + body2.body.sleeping
        ]);

        debug.clear();
        debug.fillStyle(0xffff00, 1);
        debug.fillRect(ci.area.x, ci.area.y, ci.area.width, ci.area.height);
    }
    else
    {
        text.setText([
            'Velocity X: ' + body2.body.velocity.x,
            'Velocity Y: ' + body2.body.velocity.y,
            'Delta X: ' + body2.body._dx,
            'Delta Y: ' + body2.body._dy,
            'Angle: ' + body2.body.angle,
            'Speed: ' + body2.body.speed,
            '_sleep: ' + body2.body._sleep,
            'sleeping: ' + body2.body.sleeping
        ]);
    }

    /*
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

            // 'isBlockedX: ' + monitor.body.isBlockedX(),
            // 'isBlockedY: ' + monitor.body.isBlockedY(),
            // 'isBlockedUp: ' + monitor.body.isBlockedUp(),
            // 'isBlockedDown: ' + monitor.body.isBlockedDown(),
            // 'isBlockedLeft: ' + monitor.body.isBlockedLeft(),
            // 'isBlockedRight: ' + monitor.body.isBlockedRight(),


        text.setText([
            'BLOCKED = None: ' + blocked.none + ' Up: ' + blocked.up + ' Down: ' + blocked.down + ' Left: ' + blocked.left + ' Right: ' + blocked.right,
            'HARD BLOCKED = None: ' + hardBlocked.none + ' Up: ' + hardBlocked.up + ' Down: ' + hardBlocked.down + ' Left: ' + hardBlocked.left + ' Right: ' + hardBlocked.right,
            'WORLD BLOCKED = None: ' + worldBlocked.none + ' Up: ' + worldBlocked.up + ' Down: ' + worldBlocked.down + ' Left: ' + worldBlocked.left + ' Right: ' + worldBlocked.right,
            'TOUCHING = None: ' + touching.none + ' Up: ' + touching.up + ' Down: ' + touching.down + ' Left: ' + touching.left + ' Right: ' + touching.right,
            '',
            'sprite x: ' + (mx - mww),
            'sprite y: ' + (my - mhh),
            'sprite right: ' + ((mx - mww) + mw),
            'sprite bottom: ' + ((my - mhh) + mh),
            '',
            'timeCollision: ' + monitor.body.timeCollision,
            'embeddedY: ' + monitor.body.embeddedY,
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
    */

}
