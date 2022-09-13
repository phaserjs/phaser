var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    backgroundColor: '#0072bc',
    width: 800,
    height: 600,
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
var leftKeyDebug;
var rightKeyDebug;
var upKeyDebug;
var downKeyDebug;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('elephant', 'assets/sprites/elephant.png');
}

function create ()
{
    cursors = this.input.keyboard.createCursorKeys();

    player = this.physics.add.image(400, 300, 'elephant');

    player.setCollideWorldBounds(true);

    leftKeyDebug = this.add.text(10, 300, 'Left', { font: '16px Courier', fill: '#00ff00' });
    rightKeyDebug = this.add.text(570, 300, 'Right', { font: '16px Courier', fill: '#00ff00' });
    upKeyDebug = this.add.text(300, 10, 'Up', { font: '16px Courier', fill: '#00ff00' });
    downKeyDebug = this.add.text(300, 530, 'Down', { font: '16px Courier', fill: '#00ff00' });
}

function update ()
{
    player.setVelocity(0);

    if (cursors.left.isDown)
    {
        player.setVelocityX(-300);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(300);
    }

    if (cursors.up.isDown)
    {
        player.setVelocityY(-300);
    }
    else if (cursors.down.isDown)
    {
        player.setVelocityY(300);
    }

    leftKeyDebug.setText([
        'Left: ' + cursors.left.isDown,
        'down: ' + cursors.left.timeDown,
        'up: ' + cursors.left.timeUp,
        'duration: ' + ((cursors.left.isDown) ? cursors.left.getDuration() : cursors.left.duration)
    ]);

    rightKeyDebug.setText([
        'Right: ' + cursors.right.isDown,
        'down: ' + cursors.right.timeDown,
        'up: ' + cursors.right.timeUp,
        'duration: ' + ((cursors.right.isDown) ? cursors.right.getDuration() : cursors.right.duration)
    ]);

    upKeyDebug.setText([
        'Up: ' + cursors.up.isDown,
        'down: ' + cursors.up.timeDown,
        'up: ' + cursors.up.timeUp,
        'duration: ' + ((cursors.up.isDown) ? cursors.up.getDuration() : cursors.up.duration)
    ]);

    downKeyDebug.setText([
        'Down: ' + cursors.down.isDown,
        'down: ' + cursors.down.timeDown,
        'up: ' + cursors.down.timeUp,
        'duration: ' + ((cursors.down.isDown) ? cursors.down.getDuration() : cursors.down.duration)
    ]);
}
