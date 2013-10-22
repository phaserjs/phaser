
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('phaser', 'assets/sprites/phaser-dude.png');

}

var sprite;

var upKey;
var downKey;
var leftKey;
var rightKey;

function create() {

    game.stage.backgroundColor = '#736357';

    sprite = game.add.sprite(300, 300, 'phaser');

    //  In this example we'll create 4 specific keys (up, down, left, right) and monitor them in our update function

    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

}

function update() {

    if (upKey.isDown)
    {
        sprite.y--;
    }
    else if (downKey.isDown)
    {
        sprite.y++;
    }

    if (leftKey.isDown)
    {
        sprite.x--;
    }
    else if (rightKey.isDown)
    {
        sprite.x++;
    }

}
