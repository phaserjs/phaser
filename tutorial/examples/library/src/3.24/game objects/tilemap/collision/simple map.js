var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var map;
var tileset;
var layer;
var player;

var pickups;
var cursors;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('tiles', 'assets/tilemaps/tiles/gridtiles.png');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/simple-map.json');
    this.load.image('player', 'assets/sprites/phaser-dude.png');
}

function create ()
{
    map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
    tileset = map.addTilesetImage('tiles');
    layer = map.createDynamicLayer('Level1', tileset);

    map.setCollision([ 20, 48 ]);

    pickups = map.filterTiles(function (tile) {
        return (tile.index === 82);
    });

    player = this.add.rectangle(96, 96, 24, 38, 0xffff00);

    this.physics.add.existing(player);

    this.physics.add.collider(player, layer);

    cursors = this.input.keyboard.createCursorKeys();

    cursors.up.on('down', function () {
        if (player.body.blocked.down)
        {
            player.body.setVelocityY(-360);
        }
    }, this);
}

function update ()
{
    player.body.setVelocityX(0);

    if (cursors.left.isDown)
    {
        player.body.setVelocityX(-200);
    }
    else if (cursors.right.isDown)
    {
        player.body.setVelocityX(200);
    }

    this.physics.world.overlapTiles(player, pickups, hitPickup, null, this);
}

function hitPickup (player, tile)
{
    map.removeTile(tile, 29, false);

    pickups = map.filterTiles(function (tile) {
        return (tile.index === 82);
    });
}
