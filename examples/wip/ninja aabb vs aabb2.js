
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

    sprite1 = game.add.sprite(100, 450, 'block');
    sprite1.name = 'blockA';

    sprite2 = game.add.sprite(600, 450, 'block');
    sprite2.name = 'blockB';
    sprite2.tint = Math.random() * 0xffffff;

    game.physics.ninja.enableAABB([sprite1, sprite2]);

    // sprite1.body.immovable = true;
    sprite1.body.immovable = false;
    // sprite2.body.immovable = true;
    sprite2.body.immovable = false;

    cursors = game.input.keyboard.createCursorKeys();

    game.input.onDown.add(t, this);

}

function t() {

    sprite1.body.shape.oldpos.x = sprite1.body.shape.pos.x - 30;
    sprite2.body.shape.oldpos.x = sprite2.body.shape.pos.x + 20;

}

function update() {

    //  Whichever one goes first utterly changes how the collision happens!
    game.physics.ninja.collide(sprite1, sprite2);
    // game.physics.ninja.collide(sprite2, sprite1);




    // game.physics.ninja.collide(sprite1, tile);
    // game.physics.ninja.collide(sprite2, tile);

    // sprite1.body.moveRight(5);

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
