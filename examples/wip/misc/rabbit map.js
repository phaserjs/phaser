
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('map', 'assets/tilemaps/maps/features_test.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
    game.load.image('walls_1x2', 'assets/tilemaps/tiles/walls_1x2.png');
    game.load.image('tiles2', 'assets/tilemaps/tiles/tiles2.png');

    game.load.image('ball', 'assets/sprites/shinyball.png');
    game.load.image('phaser', 'assets/sprites/firstaid.png');
    // game.load.image('phaser', 'assets/sprites/atari130xe.png');
    // game.load.image('phaser', 'assets/sprites/mushroom2.png');

}

var cursors;
var map;
var coins;

var layer;
var layer2;
var layer3;

var sprite;
var ball;
var marker;

function create() {

console.log(' --- state create start ---');

    $('#step').click(function(){
        game.step();
    });

    game.stage.backgroundColor = '#124184';


    marker = new Phaser.Line(256, 0, 256, 600);

    map = game.add.tilemap('map');

    map.addTilesetImage('ground_1x1');
    map.addTilesetImage('walls_1x2');
    map.addTilesetImage('tiles2');

    map.setCollisionBetween(1, 12);

    layer = map.createLayer('Tile Layer 1');

    // layer.debug = true;

    layer.resizeWorld();

    game.physics.gravity.y = 200;


    sprite = game.add.sprite(100, 240, 'phaser');
    // sprite.anchor.setTo(0.5, 0.5);
    // sprite.body.setCircle(20);

    // sprite.body.moves = false;

    ball = game.add.sprite(200, 180, 'ball');

    // game.add.tween(sprite).to({x: 500},5000,Phaser.Easing.Linear.None,true);

    // game.add.tween(sprite).to({angle: 360},5000,Phaser.Easing.Linear.None,true);

    // sprite = game.add.sprite(200, 240, 'phaser'); // 3-block corner test

    // sprite.debug = true;
    // game.stepping = true;

    // sprite.body.velocity.y = -300;

    // sprite.body.velocity.y = 200;






    //  We'll set a lower max angular velocity here to keep it from going totally nuts
    // sprite.body.maxAngular = 500;

    //  Apply a drag otherwise the sprite will just spin and never slow down
    // sprite.body.angularDrag = 50;

    // sprite.body.bounce.x = 0.8;
    sprite.body.bounce.y = 0.8;

    // sprite.angle = 35;

    game.camera.follow(sprite);

    // game.input.onDown.add(getIt, this);

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

// console.log(' --- state update start ---');

/*
    if (cursors.left.isDown)
    {
        game.camera.x -= 1;
    }
    else if (cursors.right.isDown)
    {
        game.camera.x += 1;
    }

    if (cursors.up.isDown)
    {
        layer.scrollY -= 4;
    }
    else if (cursors.down.isDown)
    {
        layer.scrollY += 4;
    }
*/

    game.physics.collide(sprite, layer);
    game.physics.collide(sprite, ball);

    // sprite.body.velocity.y = -300;

        // sprite.body.angularVelocity = -100;
        // sprite.body.angularAcceleration = 200;


    // sprite.body.velocity.x = 0;
    // sprite.body.velocity.y = 0;
    sprite.body.angularVelocity = 0;

    // sprite.body.acceleration.x = 0;
    // sprite.body.angularAcceleration = 0;

    if (cursors.left.isDown)
    {
        // sprite.body.acceleration.x = -200;
        sprite.body.angularVelocity = -300;
        // sprite.body.angularAcceleration -= 200;
    }
    else if (cursors.right.isDown)
    {
        // sprite.body.acceleration.x = 200;
        sprite.body.angularVelocity = 300;
        // sprite.body.angularAcceleration += 200;
    }

    if (cursors.up.isDown)
    {
        game.physics.velocityFromAngle(sprite.angle, 300, sprite.body.velocity);
    }




    /*
    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;

    sprite.angle = sprite.angle + 1;
    */

    // if (cursors.up.isDown)
    // {
    //     sprite.body.velocity.y = -200;
    // }
    // else if (cursors.down.isDown)
    // {
    //     sprite.body.velocity.y = 100;
    // }

    // if (cursors.left.isDown)
    // {
    //     sprite.body.velocity.x = -200;
    // }
    // else if (cursors.right.isDown)
    // {
    //     sprite.body.velocity.x = 200;
    // }

    // if (cursors.up.isDown)
    // {
    //     sprite.y -= 2;
    // }
    // else if (cursors.down.isDown)
    // {
    //     sprite.y += 2;
    // }

    // if (cursors.left.isDown)
    // {
    //     sprite.x -= 2;
    // }
    // else if (cursors.right.isDown)
    // {
    //     sprite.x += 2;
    // }

    // if (cursors.up.isDown)
    // {
    //     sprite.body.y -= 2;
    // }
    // else if (cursors.down.isDown)
    // {
    //     sprite.body.y += 2;
    // }

    // if (cursors.left.isDown)
    // {
    //     sprite.body.x -= 2;
    // }
    // else if (cursors.right.isDown)
    // {
    //     sprite.body.x += 2;
    // }



}

function render() {

    // game.debug.spriteBody(sprite);
    // game.debug.spriteBounds(sprite);

    game.debug.physicsBody(sprite.body);
    game.debug.bodyInfo(sprite, 32, 32);

    // game.debug.line(marker, 'rgba(255,255,255,0.5)');

    // game.debug.text(sprite.deltaX, 32, 32);
    // game.debug.text(sprite.deltaY, 32, 48);
    // game.debug.text(sprite.body.deltaX(), 232, 32);
    // game.debug.text(sprite.body.deltaY(), 232, 48);

    // game.debug.text(sprite.body.left, 32, 32);
    // game.debug.text(sprite.body.top, 32, 48);

    // game.debug.spriteCoords(sprite, 32, 320);

}