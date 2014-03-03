
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('map', 'assets/tilemaps/maps/platform.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('platformer_tiles', 'assets/tilemaps/tiles/platformer_tiles.png');
    game.load.spritesheet('gameboy', 'assets/sprites/gameboy_seize_color_40x60.png', 40, 60);
    game.load.spritesheet('balls', 'assets/sprites/balls.png', 17, 17);

}

var map;
var layer;
var sprite;
var sprite2;
var balls;
var cursors;

function create() {

    game.stage.backgroundColor = '#124184';

    map = game.add.tilemap('map');

    map.addTilesetImage('platformer_tiles');

    map.setCollisionBetween(21, 53);

    layer = map.createLayer('Tile Layer 1');

    layer.debug = true;

    // game.physics.gravity.y = 150;

/*
    balls = game.add.group();

    for (var i = 0; i < 30; i++)
    {
        var s = balls.create(game.rnd.integerInRange(100, 700), game.rnd.integerInRange(100, 200), 'balls', game.rnd.integerInRange(0, 6));
        s.body.velocity.x = game.rnd.integerInRange(-400, 400);
        s.body.velocity.y = game.rnd.integerInRange(-100, -200);
        s.name = 'ball' + i;
    }

    balls.setAll('body.collideWorldBounds', true);
    balls.setAll('body.bounce.x', 0.8);
    balls.setAll('body.bounce.y', 0.9);
    balls.setAll('body.minBounceVelocity', 0.9);
    balls.setAll('body.linearDamping', 0.5);
*/

    sprite2 = game.add.sprite(340, 250, 'gameboy', 2);
    sprite2.name = 'green';
    sprite2.body.collideWorldBounds = true;
    // sprite2.body.bounce.setTo(0.5, 0.5);

    sprite = game.add.sprite(270, 100, 'gameboy', 0);
    sprite.name = 'red';
    sprite.body.collideWorldBounds = true;
    sprite.body.minBounceVelocity = 0.9;
    sprite.body.bounce.setTo(0.5, 0.9);
    sprite.body.linearDamping = 0.5;


    game.input.onDown.add(launch, this);

}

function launch() {

    // sprite.body.velocity.x = -200;
    // sprite.body.velocity.y = -200;

    sprite2.body.velocity.x = -200;
    sprite2.body.velocity.y = -200;

}

function hit(face, body1, body2) {

    console.log('hit', face);

}

var flag = false;

function update() {

    // game.physics.collide(balls, layer);
    game.physics.collide(sprite, layer);
    game.physics.collide(sprite2, layer);
    game.physics.collide(sprite, sprite2);
 
}

function render() {

    game.debug.bodyInfo(sprite2, 32, 32);
    game.debug.physicsBody(sprite2.body);


    // game.debug.text(sprite2.body.left, 32, 30);
    // game.debug.text(sprite2.body.right, 32, 50);
    // game.debug.text(sprite2.body.top, 32, 70);
    // game.debug.text(sprite2.body.bottom, 32, 90);

 
    // for (var i = 0; i < balls._container.length; i++)
    // {

    // }

    // if (sprite)
    // {
    //     // game.debug.bodyInfo(sprite, 20, 30);
        // game.debug.bodyInfo(sprite2, 20, 230);
    // }

}