
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('backdrop', 'assets/pics/remember-me.jpg');
	game.load.image('box', 'assets/sprites/block.png');

}

var cursors;
var sprite;

function create() {

    game.world.setBounds(0, 0, 1920, 1200);
    game.add.image(0, 0, 'backdrop');

    sprite = game.add.sprite(300, 300, 'box');

    game.camera.follow(sprite);

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    if (cursors.left.isDown)
    {
    	sprite.x -= 8;
    }
    else if (cursors.right.isDown)
    {
    	sprite.x += 8;
    }

    if (cursors.up.isDown)
    {
    	sprite.y -= 8;
    }
    else if (cursors.down.isDown)
    {
    	sprite.y += 8;
    }

}

function render() {


}
