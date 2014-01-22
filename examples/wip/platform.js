
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('map', 'assets/tilemaps/maps/platform.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('platformer_tiles', 'assets/tilemaps/tiles/platformer_tiles.png');
    game.load.spritesheet('gameboy', 'assets/sprites/gameboy_seize_color_40x60.png', 40, 60);

}

var map;
var layer;
var sprite;

function create() {

    game.stage.backgroundColor = '#124184';

    map = game.add.tilemap('map');

    map.addTilesetImage('platformer_tiles');

    map.setCollisionBetween(32, 35);
    map.setCollisionByIndex(21);

    layer = map.createLayer('Tile Layer 1');

    // layer.debug = true;

    game.physics.gravity.y = 200;

    sprite = game.add.sprite(300, 100, 'gameboy', 0);
    sprite.name = 'red';
    sprite.body.collideWorldBounds = true;
    sprite.body.bounce.setTo(0.5, 0.5);

    game.input.onDown.add(launch, this);

}

function launch() {

    sprite.body.velocity.x = -200;
    sprite.body.velocity.y = -200;

}


function hit(face, body1, body2) {

    console.log('hit', face);

}

function update() {

    game.physics.collide(sprite, layer);

}

function render() {

    if (sprite)
    {
        game.debug.renderBodyInfo(sprite, 20, 30);
    }

}