var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var stars;
var ground;
var cursors;
var platform;

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

    ground = this.physics.add.staticImage(400, 568, 'ground').setScale(2).refreshBody();

    platform = this.physics.add.image(400, 400, 'ground');

    platform.setImmovable(true);
    platform.body.allowGravity = false;

    player = this.physics.add.sprite(100, 450, 'dude');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

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

    stars = this.physics.add.group({
        key: 'star',
        frameQuantity: 12,
        maxSize: 12,
        active: false,
        visible: false,
        enable: false,
        collideWorldBounds: true,
        bounceX: 0.5,
        bounceY: 0.5,
        dragX: 30,
        dragY: 0
    });

    this.physics.add.collider(
        player,
        platform,
        function (_player, _platform)
        {
            if (_player.body.touching.up && _platform.body.touching.down)
            {
                createStar(
                    _player.body.center.x,
                    _platform.body.top - 16,
                    _player.body.velocity.x,
                    _player.body.velocity.y * -3
                );
            }
        });

    this.physics.add.collider(player, ground);
    this.physics.add.collider(stars, ground);
    this.physics.add.collider(stars, platform);

    this.physics.add.overlap(player, stars, collectStar, null, this);
}

function update ()
{
    if (cursors.left.isDown)
    {
        player.setVelocityX(-180);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(180);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-360);
    }
}

function collectStar (player, star)
{
    star.disableBody(true, true);
}

function createStar(x, y, vx, vy)
{
    var star = stars.get();

    if (!star) return;

    star
        .enableBody(true, x, y, true, true)
        .setVelocity(vx, vy);
}
