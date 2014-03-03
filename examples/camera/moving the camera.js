
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');
}

var cursors;

function create() {

    game.stage.backgroundColor = '#2d2d2d';

    //  Make our game world 2000x2000 pixels in size (the default is to match the game size)
    game.world.setBounds(0, 0, 2000, 2000);

    for (var i = 0; i < 150; i++)
    {
        game.add.sprite(game.world.randomX, game.world.randomY, 'mushroom');
    }

    cursors = game.input.keyboard.createCursorKeys();

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

    game.debug.cameraInfo(game.camera, 32, 32);

}
