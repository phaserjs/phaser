
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update,render : render });

function preload() {

    game.world.setBounds(0, 0, 1920, 1200);

    game.load.image('backdrop', 'assets/pics/remember-me.jpg');
    game.load.image('card', 'assets/sprites/mana_card.png');

}

var card;
var Keys = Phaser.Keyboard;

function create() {

    game.add.sprite(0, 0, 'backdrop');

    card = game.add.sprite(200, 200, 'card');

    card.body.velocity.x = 50;
    card.scale.setTo(2, 2);

}

function update() {

    if (game.input.keyboard.isDown(Keys.LEFT))
    {
        card.x -= 4;
    }
    else if (game.input.keyboard.isDown(Keys.RIGHT))
    {
        card.x += 4;
    }

    if (game.input.keyboard.isDown(Keys.UP))
    {
        card.y -= 4;
    }
    else if (game.input.keyboard.isDown(Keys.DOWN))
    {
        card.y += 4;
    }

}

function render() {

    game.debug.renderCameraInfo(game.camera, 32, 32);
    game.debug.renderSpriteInfo(card, 32, 200);

}
