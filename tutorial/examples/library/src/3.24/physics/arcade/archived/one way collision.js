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

var atari;
var cursors;
var player;
var stop = false;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('atari', 'assets/sprites/atari130xe.png');
    this.load.image('mushroom', 'assets/sprites/mushroom2.png');
    this.load.image('mushroom2', 'assets/sprites/mushroom16x16.png');
    this.load.image('bg', 'assets/tests/32pxstrip.png');
}

function create ()
{
    this.add.image(0, 0, 'bg').setOrigin(0);

    atari = this.physics.add.image(400, 300, 'atari').setImmovable(true).setName('atari');

    atari.body.onCollide = true;

    //  This body will only check for vertical collisions
    atari.body.setCheckCollisionX(false);
    // atari.body.setCheckCollisionY(false);

    // var mushroom1 = this.physics.add.image(400, 100, 'mushroom').setName('mushytop');
    var mushroom2 = this.physics.add.image(100, 300, 'mushroom').setName('mushyside');

    player = mushroom2;

    // mushroom1.setVelocityY(100);
    // mushroom1.setBounce(1);
    // mushroom1.setCollideWorldBounds(true, 1, 1);

    // mushroom2.setVelocityX(100);
    // mushroom2.setBounce(1);
    // mushroom2.setCollideWorldBounds(true);

    // this.physics.add.collider(atari, [ mushroom1, mushroom2 ]);

    this.physics.add.collider(atari, mushroom2);

    this.input.keyboard.on('keydown-SPACE', function () {
        console.log('stop');
        stop = true;
        this.physics.world.isPaused = true;
    }, this);

    var text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#000000' });

    var faces = { 10: 'None', 11: 'Up', 12: 'Down', 13: 'Left', 14: 'Right' };

    this.physics.world.on('collide', function (ci) {


        text.setText([
            'embedded: ' + ci.embedded,
            'max: ' + ci.maxX,
            'intersects: ' + ci.intersects,
            'touching: ' + ci.touching,
            'overlapOnly: ' + ci.overlapOnly,
            'overlapX: ' + ci.overlapX,
            'overlapY: ' + ci.overlapY,
            'forceX: ' + ci.forceX,
            'face: ' + faces[ci.face],
            'faceX: ' + ci.faceX,
            'faceY: ' + ci.faceY
        ]);

    });

    cursors = this.input.keyboard.createCursorKeys();
}

function update (time)
{
    if (stop)
    {
        return;
    }

    player.setVelocity(0);

    if (cursors.left.isDown)
    {
        player.setVelocityX(-200);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(200);
    }

    if (cursors.up.isDown)
    {
        player.setVelocityY(-200);
    }
    else if (cursors.down.isDown)
    {
        player.setVelocityY(200);
    }
}
