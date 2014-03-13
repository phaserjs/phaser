
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render });

function preload() {

    game.load.atlasJSONHash('bot', 'assets/sprites/running_bot.png', 'assets/sprites/running_bot.json');
    game.load.spritesheet('mummy', 'assets/sprites/metalslug_mummy37x45.png', 37, 45, 18);

}

var bot;

function create() {

    bot = game.add.sprite(200, 200, 'bot');

    bot.animations.add('run');

    bot.animations.play('run', 15, true);

    game.input.onDown.addOnce(changeMummy, this);

}

function changeMummy() {

    bot.loadTexture('mummy', 0);

    bot.animations.add('walk');

    bot.animations.play('walk', 30, true);

}

function render() {

    game.debug.body(bot);

}
