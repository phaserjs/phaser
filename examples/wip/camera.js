
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('backdrop', 'assets/pics/remember-me.jpg');
	game.load.image('box', 'assets/sprites/block.png');

}

var cursors;

function create() {

    game.world.setBounds(0, 0, 1920, 1200);
    game.add.sprite(0, 0, 'backdrop');

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    if (cursors.left.isDown)
    {
    	game.camera.x -= 8;
    }
    else if (cursors.right.isDown)
    {
    	game.camera.x += 8;
    }

    if (cursors.up.isDown)
    {
    	game.camera.y -= 8;
    }
    else if (cursors.down.isDown)
    {
    	game.camera.y += 8;
    }

}

function render() {


}
