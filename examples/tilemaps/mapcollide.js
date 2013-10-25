
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('mario', 'assets/maps/mario1.png', 'assets/maps/mario1.json', null, Phaser.Tilemap.JSON);
    game.load.image('player', 'assets/sprites/phaser-dude.png');

}

var map;
var p;
var cursors;

function create() {

    game.stage.backgroundColor = '#787878';

    map = game.add.tilemap(0, 0, 'mario');

    //  floor
    map.setCollisionRange(80, 97, true, true, true, true);

    //  one-ways
    map.setCollisionRange(15, 17, true, true, false, true);

    p = game.add.sprite(32, 32, 'player');

    p.body.gravity.y = 10;
    p.body.bounce.y = 0.4;
    p.body.collideWorldBounds = true;

    game.world.setBounds(0, 0, map.width, 600);

    game.camera.follow(p);

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    map.collide(p);

    p.body.velocity.x = 0;

    if (cursors.up.isDown)
    {
        if (p.body.touching.down)
        {
            p.body.velocity.y = -400;
        }
    }
    else if (cursors.down.isDown)
    {
        // game.camera.y += 4;
    }

    if (cursors.left.isDown)
    {
        p.body.velocity.x = -150;
    }
    else if (cursors.right.isDown)
    {
        p.body.velocity.x = 150;
    }

}

function render() {

    game.debug.renderCameraInfo(game.camera, 32, 32);
    // game.debug.renderSpriteCorners(p);
    game.debug.renderSpriteCollision(p, 32, 320);

}
