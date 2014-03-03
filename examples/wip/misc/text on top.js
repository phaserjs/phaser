
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render : render });

function preload() {

    game.load.image('mushroom', 'assets/sprites/mushroom2.png');

}

var cursors;
var group;
var text;
var timer;

function create() {

    game.stage.backgroundColor = '#007236';

    for (var i = 0; i < 200; i++)
    {
        game.add.sprite(game.world.randomX, game.world.randomY, 'mushroom');
    }

    text = game.add.text(0, 0, "Text Above Sprites", { font: "64px Arial", fill: "#00bff3", align: "center" });

    timer = new Phaser.Timer(game);
    timer.add(1000);

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    timer.update();

    if (cursors.up.isDown)
    {
        text.y -= 4;
    }
    else if (cursors.down.isDown)
    {
        text.y += 4;
    }

    if (cursors.left.isDown)
    {
        text.x -= 4;
    }
    else if (cursors.right.isDown)
    {
        text.x += 4;
    }

}

function render() {

    // game.debug.cameraInfo(game.camera, 32, 32);

}
