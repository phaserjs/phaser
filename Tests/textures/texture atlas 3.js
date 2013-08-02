/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update);
    function init() {
        //  Texture Atlas Method 3
        //
        //  In this example we assume that the TexturePacker JSON data is stored in an external file
        game.load.atlas('bot', 'assets/sprites/running_bot.png', 'assets/sprites/running_bot.json');
        game.load.start();
    }
    var bot;
    function create() {
        bot = game.add.sprite(game.stage.width, 300, 'bot');
        bot.animations.add('run');
        bot.animations.play('run', 10, true);
    }
    function update() {
        bot.x -= 2;
        if(bot.x < -bot.width) {
            bot.x = game.stage.width;
        }
    }
})();
