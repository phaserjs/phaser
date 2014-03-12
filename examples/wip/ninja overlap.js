
// var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.spritesheet('gameboy', 'assets/sprites/gameboy_seize_color_40x60.png', 40, 60);
    game.load.image('diamond', 'assets/sprites/diamond.png');
    game.load.image('sky', 'assets/skies/cavern1.png');

}

var sprite1;
var cursors;
var diamonds;

function create() {

    game.add.image(0, 0, 'sky');

	game.physics.startSystem(Phaser.Physics.NINJA);

    game.physics.ninja.gravity = 0;

    sprite1 = game.add.sprite(500, 200, 'gameboy');
    game.physics.ninja.enableAABB(sprite1);

    diamonds = game.add.group();
    diamonds.enableBody = true;

    for (var i = 0; i < 20; i++)
    {
        var d = diamonds.create(game.world.randomX, game.world.randomY, 'diamond');
    }

    cursors = game.input.keyboard.createCursorKeys();

}

function collisionHandler(s, d) {

    d.kill();

}

function update() {

    game.physics.arcade.overlap(sprite1, diamonds, collisionHandler, null, this);

    if (cursors.left.isDown)
    {
        sprite1.body.moveLeft(10);
    }
    else if (cursors.right.isDown)
    {
        sprite1.body.moveRight(10);
    }

    if (cursors.up.isDown)
    {
        sprite1.body.moveUp(10);
    }
    else if (cursors.down.isDown)
    {
        sprite1.body.moveDown(10);
    }

}

function render() {

    game.debug.rectangle(sprite1.body);

    for (var i = 0; i < diamonds.length; i++)
    {
        game.debug.rectangle(diamonds.children[i].body);
    }


}
