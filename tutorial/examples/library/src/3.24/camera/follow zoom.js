var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    pixelArt: true,
    physics: {
        default: 'arcade',
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var ship;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('map', 'assets/tests/camera/earthbound-scarab.png');
    this.load.image('ship', 'assets/sprites/fmship.png');
}

function create ()
{
    this.cameras.main.setBounds(0, 0, 1024, 2048);
    
    this.add.image(0, 0, 'map').setOrigin(0).setScrollFactor(1);

    cursors = this.input.keyboard.createCursorKeys();

    ship = this.physics.add.image(400.5, 301.3, 'ship');
    // ship = this.add.image(400.5, 301.3, 'ship');

    this.cameras.main.startFollow(ship, true, 0.09, 0.09);
    // this.cameras.main.roundPixels = true;

    this.cameras.main.setZoom(4);
}

function updateDirect ()
{
    if (cursors.left.isDown)
    {
        ship.setAngle(-90);
        ship.x -= 2.5;
    }
    else if (cursors.right.isDown)
    {
        ship.setAngle(90);
        ship.x += 2.5;
    }

    if (cursors.up.isDown)
    {
        ship.setAngle(0);
        ship.y -= 2.5;
    }
    else if (cursors.down.isDown)
    {
        ship.setAngle(-180);
        ship.y += 2.5;
    }
}

function update ()
{
    ship.setVelocity(0);

    if (cursors.left.isDown)
    {
        ship.setAngle(-90).setVelocityX(-200);
    }
    else if (cursors.right.isDown)
    {
        ship.setAngle(90).setVelocityX(200);
    }

    if (cursors.up.isDown)
    {
        ship.setAngle(0).setVelocityY(-200);
    }
    else if (cursors.down.isDown)
    {
        ship.setAngle(-180).setVelocityY(200);
    }
}