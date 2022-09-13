var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var player;
var cursors;

function preload ()
{
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/tile_properties.json');
    this.load.image('tiles', 'assets/tilemaps/tiles/gridtiles.png');
    this.load.image('ball', 'assets/sprites/orb-blue.png');
}

function create ()
{
    var map = this.make.tilemap({ key: 'map' });
    var tileset = map.addTilesetImage('tiles');
    var layer = map.createLayer('Tile Layer 1', tileset, 0, 0);

    map.setCollision([ 34, 20 ]); // 20 = dark gray, 32 = dark blue
    // map.setCollision([ 136 ]); // dark brown
    // map.setCollision([ 80 ]); // yellow
    // map.setCollision([ 122 ]); // light brown

    player = this.physics.add.sprite(48, 48, 'ball');

    this.physics.add.collider(player, layer);

    // this.physics.add.collider(player, layer, () => {
    //     console.log('colliding');
    // });

    // this.physics.add.overlap(player, layer, () => {
    //     console.log('overlapping');
    // });

    cursors = this.input.keyboard.createCursorKeys();
}

function update (time, delta)
{
    player.setVelocity(0);

    // Horizontal movement
    if (cursors.left.isDown)
    {
        player.setVelocityX(-100);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(100);
    }

    // Vertical movement
    if (cursors.up.isDown)
    {
        player.setVelocityY(-100);
    }
    else if (cursors.down.isDown)
    {
        player.setVelocityY(100);
    }
}
