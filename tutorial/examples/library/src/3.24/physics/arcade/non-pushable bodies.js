var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player1;
var player2;
var currentPlayer;
var cursors;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'src/games/firstgame/assets/sky.png');
    this.load.image('ground', 'src/games/firstgame/assets/platform.png');
    this.load.image('star', 'src/games/firstgame/assets/star.png');
    this.load.spritesheet('dude', 'src/games/firstgame/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
    this.add.image(400, 300, 'sky');

    var ground = this.physics.add.staticGroup();

    ground.create(400, 568, 'ground').setScale(2).refreshBody();

    player1 = this.physics.add.sprite(100, 450, 'dude').setBounce(0.2).setCollideWorldBounds(true);
    player2 = this.physics.add.sprite(500, 450, 'dude').setTint(0xff0000).setBounce(0.2).setCollideWorldBounds(true);

    player1.name = 'Purple';
    player2.name = 'Red';

    player2.setPushable(false);

    currentPlayer = player1;

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(player1, ground);
    this.physics.add.collider(player2, ground);

    this.physics.add.collider(player1, player2);
    // this.physics.add.collider(player2, player1);

    window.body1 = player1.body;
    window.physics = this.physics;
    window.showit = false;

    this.input.on('pointerdown', function () {

        if (currentPlayer === player1)
        {
            currentPlayer = player2;
        }
        else
        {
            currentPlayer = player1;
        }

    }, this);
}

function update ()
{
    if (cursors.left.isDown)
    {
        currentPlayer.setVelocityX(-160);

        currentPlayer.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        currentPlayer.setVelocityX(160);

        currentPlayer.anims.play('right', true);
    }
    else
    {
        currentPlayer.setVelocityX(0);

        currentPlayer.anims.play('turn');
    }

    if (cursors.up.isDown && currentPlayer.body.touching.down)
    {
        currentPlayer.setVelocityY(-330);

        window.showit = true;
    }
}
