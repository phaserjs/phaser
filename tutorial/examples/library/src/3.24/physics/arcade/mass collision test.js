var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            useTree: false,
            gravity: { y: 100 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var controls;
var player;
var group;
var spriteBounds;
var text;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('chunk', 'assets/sprites/rain.png');
    this.load.image('crate', 'assets/sprites/crate.png');
}

function release ()
{
    for (var i = 0; i < 100; i++)
    {
        var pos = Phaser.Geom.Rectangle.Random(spriteBounds);

        var block = group.create(pos.x, pos.y, 'chunk');

        block.setBounce(1);
        block.setCollideWorldBounds(true);
        block.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-100, -200));
        block.setMaxVelocity(300);
        block.setBlendMode(1);
    }

    text.setText('Total: ' + group.getLength());
}

function create ()
{
    var graphics = this.add.graphics();
    graphics.fillStyle(0x000044);
    graphics.fillRect(0,140,800,460);

    this.physics.world.setBounds(0, 0, 800, 600);

    spriteBounds = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(this.physics.world.bounds), -10, -200);
    spriteBounds.y += 100;

    group = this.physics.add.group();
    group.runChildUpdate = false;

    //  Create 10,000 bodies at a rate of 100 bodies per 500ms
    this.time.addEvent({ delay: 500, callback: release, callbackScope: this, repeat: (10000 / 100) - 1 });

    cursors = this.input.keyboard.createCursorKeys();

    player = this.physics.add.image(400, 100, 'crate');

    player.setImmovable();
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, group);

    text = this.add.text(10, 10, 'Total: 0', { font: '16px Courier', fill: '#ffffff' });
}

function update ()
{
    player.setVelocity(0);

    if (cursors.left.isDown)
    {
        player.setVelocityX(-500);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(500);
    }

    if (cursors.up.isDown)
    {
        player.setVelocityY(-500);
    }
    else if (cursors.down.isDown)
    {
        player.setVelocityY(500);
    }
}
