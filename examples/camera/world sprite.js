
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('backdrop', 'assets/pics/remember-me.jpg');
    game.load.image('card', 'assets/sprites/mana_card.png');

}

var card;
var cursors;

function create() {

    game.world.setBounds(0, 0, 1920, 1200);

    game.add.sprite(0, 0, 'backdrop');

    card = game.add.sprite(200, 200, 'card');

    game.camera.follow(card);

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    if (cursors.left.isDown)
    {
        card.x -= 4;
    }
    else if (cursors.right.isDown)
    {
        card.x += 4;
    }

    if (cursors.up.isDown)
    {
        card.y -= 4;
    }
    else if (cursors.down.isDown)
    {
        card.y += 4;
    }

}

function render() {

    game.debug.cameraInfo(game.camera, 500, 32);
    game.debug.spriteCoords(card, 32, 32);
    // game.debug.physicsBody(card.body);

}
