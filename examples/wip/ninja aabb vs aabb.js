
// var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('block', 'assets/sprites/block.png');
    game.load.spritesheet('ninja-tiles', 'assets/physics/ninja-tiles128.png', 128, 128, 34);

}

var sprite1;
var sprite2;
var tile;
var cursors;

function create() {

	game.physics.startSystem(Phaser.Physics.NINJA);

    // game.physics.ninja.gravity = 6;

    // sprite1 = game.add.sprite(200, 100, 'block');
    sprite1 = game.add.sprite(200, 500, 'block');
    sprite1.name = 'blockA';

    sprite2 = game.add.sprite(600, 100, 'block');
    sprite2.name = 'blockB';

    // game.physics.ninja.enableAABB([sprite1]);
    game.physics.ninja.enableAABB([sprite1, sprite2]);

    tile = game.add.sprite(600, 480, 'ninja-tiles', 3);
    game.physics.ninja.enableTile(tile, tile.frame);

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    game.physics.ninja.collide(sprite1, sprite2);
    game.physics.ninja.collide(sprite1, tile);
    game.physics.ninja.collide(sprite2, tile);

    sprite1.body.moveRight(5);

    if (cursors.left.isDown)
    {
        sprite1.body.moveLeft(20);
    }
    else if (cursors.right.isDown)
    {
        sprite1.body.moveRight(20);
    }

    // if (cursors.up.isDown && sprite1.body.touching.down)
    if (cursors.up.isDown)
    {
        // sprite1.body.moveUp(1000);
        sprite1.body.moveUp(30);
    }
    // else if (cursors.down.isDown)
    // {
    //     sprite1.body.moveDown(20);
    // }

}

function render() {

    game.debug.text('left: ' + sprite1.body.touching.left, 32, 32);
    game.debug.text('right: ' + sprite1.body.touching.right, 256, 32);
    game.debug.text('up: ' + sprite1.body.touching.up, 32, 64);
    game.debug.text('down: ' + sprite1.body.touching.down, 256, 64);

}
