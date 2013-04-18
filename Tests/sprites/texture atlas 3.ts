/// <reference path="../../Phaser/Phaser.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    function init() {

        //  Texture Atlas Method 3
        //
        //  In this example we assume that the TexturePacker JSON data is stored in an external file
        myGame.loader.addTextureAtlas('bot', 'assets/sprites/running_bot.png', 'assets/sprites/running_bot.json');

        myGame.loader.load();

    }

    var bot: Phaser.Sprite;

    function create() {

        bot = myGame.createSprite(myGame.stage.width, 300, 'bot');

        bot.animations.add('run');
        bot.animations.play('run', 10, true);

        bot.velocity.x = -100;

    }

    function update() {

        if (bot.x < -bot.width)
        {
            bot.x = myGame.stage.width;
        }

    }

})();
