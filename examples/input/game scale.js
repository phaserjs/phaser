
var game = new Phaser.Game(320, 240, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    //  This sets a limit on the up-scale
    game.stage.scale.maxWidth = 800;
    game.stage.scale.maxHeight = 600;

    //  Then we tell Phaser that we want it to scale up to whatever the browser can handle, but to do it proportionally
    game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;

    game.load.image('melon', 'assets/sprites/melon.png');

}

var cursors;

function create() {

    //We increase the size of our game world
    game.world.setBounds(0,0,2000, 2000);

    for (var i = 0; i < 1000; i++)
    {
        //And spread some sprites inside it
        game.add.sprite(game.world.randomX, game.world.randomY, 'melon');
    }

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    //This allows us to move the game camera using the keyboard

    if (cursors.left.isDown)
    {
        game.camera.x -= 4;
    }
    else if (cursors.right.isDown)
    {
        game.camera.x += 4;
    }

    if (cursors.up.isDown)
    {
        game.camera.y -= 4;
    }
    else if (cursors.down.isDown)
    {
        game.camera.y += 4;
    }

}

function render() {

    game.debug.renderInputInfo(16, 16);

}
