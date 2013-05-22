/// <reference path="../../Phaser/Game.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    function init() {

        myGame.loader.addImageFile('card', 'assets/sprites/mana_card.png');
        myGame.loader.addTextureAtlas('bot', 'assets/sprites/running_bot.png', 'assets/sprites/running_bot.json');
        myGame.loader.load();

    }

    var card: Phaser.Sprite;
    var bot: Phaser.Sprite;

    function create() {

        card = myGame.createSprite(200, 220, 'card');

        bot = myGame.createSprite(myGame.stage.width - 100, 300, 'bot');

        //  The collision mask is much thinner than the animated sprite
        bot.collisionMask.offset.x = 16;
        bot.collisionMask.width = 32;
        bot.renderDebug = true;

        bot.animations.add('run');
        bot.animations.play('run', 10, true);

        bot.velocity.x = -150;

    }

    function update() {

        if (bot.x < -bot.width)
        {
            bot.x = myGame.stage.width;
            bot.velocity.x = -150;
            card.x = 200;
            card.velocity.x = 0;
        }

        myGame.collide(card, bot);

    }

})();
