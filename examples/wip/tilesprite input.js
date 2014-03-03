
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('backdrop', 'assets/pics/remember-me.jpg');
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');
    game.load.image('starfield', 'assets/misc/starfield.jpg');

}

var sprite;
var cursors;
var mushroom;

function create() {

    game.world.setBounds(0, 0, 1920, 1200);
    game.add.image(0, 0, 'backdrop');

    sprite = game.add.tileSprite(100, 100, 200, 200, 'starfield');
    sprite.inputEnabled = true;
    sprite.events.onInputDown.add(scroll, this);
    sprite.input.enableDrag();

    mushroom = game.add.sprite(400, 400, 'mushroom');
    mushroom.inputEnabled = true;
    mushroom.input.enableDrag();

    game.camera.follow(mushroom);

    cursors = game.input.keyboard.createCursorKeys();

}

function scroll()
{
    sprite.autoScroll(0, 100);
}

function update() {

    if (cursors.left.isDown)
    {
        mushroom.x -= 8;
    }
    else if (cursors.right.isDown)
    {
        mushroom.x += 8;
    }

    if (cursors.up.isDown)
    {
        mushroom.y -= 8;
    }
    else if (cursors.down.isDown)
    {
        mushroom.y += 8;
    }

}

function render() {

    // game.debug.text(sprite.frame, 32, 32);

}
