/// <reference path="../../Phaser/Phaser.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    function init() {

        myGame.loader.addTextureAtlas('bot', 'assets/sprites/running_bot.png', 'assets/sprites/running_bot.json');

        myGame.loader.load();

    }

    var bot: Phaser.Sprite;

    function create() {

        bot = myGame.createSprite(myGame.stage.width, 300, 'bot');

        //  If you are using a Texture Atlas and want to specify the frames of an animation by their name rather than frame index
        //  then you can use this format:
        bot.animations.add('run', ['run00', 'run01', 'run02', 'run03', 'run04', 'run05', 'run06', 'run07', 'run08', 'run09', 'run10'], 10, true, false);

        bot.animations.play('run');

        bot.velocity.x = -100;

    }

    function update() {

        if (bot.x < -bot.width)
        {
            bot.x = myGame.stage.width;
        }

    }

})();
