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
        update: updateDirect
    }
};

var ship;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ship', 'assets/sprites/fmship.png');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/super-mario.json');
    this.load.image('tiles1', 'assets/tilemaps/tiles/super-mario.png');
}

function create ()
{
    this.cameras.main.setBounds(0, 0, 3392, 100);
    this.physics.world.setBounds(0, 0, 3392, 240);
    
    var map = this.make.tilemap({ key: 'map' });
    var tileset = map.addTilesetImage('SuperMarioBros-World1-1', 'tiles1');
    var layer = map.createStaticLayer('World1', tileset, 0, 0);

    cursors = this.input.keyboard.createCursorKeys();

    // ship = this.physics.add.image(400, 100, 'ship').setAngle(90).setCollideWorldBounds(true);
    ship = this.add.image(400, 100, 'ship').setAngle(90);

    this.cameras.main.startFollow(ship, true, 0.08, 0.08);

    this.cameras.main.setZoom(4);
}

function updateDirect ()
{
    if (cursors.left.isDown && ship.x > 0)
    {
        ship.setAngle(-90);
        ship.x -= 2.5;
    }
    else if (cursors.right.isDown && ship.x < 3392)
    {
        ship.setAngle(90);
        ship.x += 2.5;
    }

    if (cursors.up.isDown && ship.y > 0)
    {
        ship.y -= 2.5;
    }
    else if (cursors.down.isDown && ship.y < 240)
    {
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
        ship.setVelocityY(-200);
    }
    else if (cursors.down.isDown)
    {
        ship.setVelocityY(200);
    }
}