
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.stage.backgroundColor = '#007236';

	game.load.image('ball', 'assets/sprites/shinyball.png');
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');
    game.load.image('phaser', 'assets/sprites/sonic_havok_sanity.png');

}

var sprite;
var cursors;

function create() {

    game.world.setBounds(0, 0, 1000, 1000);                                

    for (var i = 0; i < 100; i++)
    {
        game.add.sprite(game.world.randomX, game.world.randomY, 'mushroom');
    }

    sprite = game.add.sprite(200, 200, 'ball');

    sprite.fixedToCamera = true;
    // sprite.cameraOffset.setTo(200, 200);


    sprite.inputEnabled = true;
    sprite.input.enableDrag();
    sprite.events.onInputOver.add(wibble, this);

    cursors = game.input.keyboard.createCursorKeys();

}

function wibble() {
	console.log('over');
}

function update() {

    if (cursors.up.isDown)
    {
        game.camera.y -= 4;
    }
    else if (cursors.down.isDown)
    {
        game.camera.y += 4;
    }

    if (cursors.left.isDown)
    {
        game.camera.x -= 4;
    }
    else if (cursors.right.isDown)
    {
        game.camera.x += 4;
    }

}

function render() {

	game.debug.text(sprite.cameraOffset.x, 32, 32);
	game.debug.text(sprite.cameraOffset.y, 32, 64);
	game.debug.pointer(game.input.activePointer);

}
