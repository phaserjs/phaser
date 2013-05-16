/// <reference path="../../Phaser/Game.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);
    function init() {
        myGame.loader.addTextureAtlas('bot', 'assets/sprites/running_bot.png', 'assets/sprites/running_bot.json');
        myGame.loader.addTextureAtlas('atlas', 'assets/pics/texturepacker_test.png', 'assets/pics/texturepacker_test.json');
        myGame.loader.load();
    }
    var bot;
    var bot2;
    var car;
    function create() {
        //  This bot will flip properly when he reaches the edge
        bot = myGame.createSprite(myGame.stage.width, 300, 'bot');
        bot.animations.add('run');
        bot.animations.play('run', 10, true);
        bot.velocity.x = -200;
        //  This one won't
        bot2 = myGame.createSprite(myGame.stage.width, 200, 'bot');
        bot2.animations.add('run');
        bot2.animations.play('run', 10, true);
        bot2.velocity.x = -150;
        //  Flip a static sprite (not an animation)
        car = myGame.createSprite(100, 400, 'atlas');
        car.frameName = 'supercars_parsec.png';
        car.flipped = true;
    }
    function update() {
        if(bot.x < -bot.width) {
            bot.flipped = true;
            bot.velocity.x = 200;
        } else if(bot.x > myGame.stage.width) {
            bot.flipped = false;
            bot.velocity.x = -200;
        }
        if(bot2.x < -bot2.width) {
            bot2.velocity.x = 200;
        } else if(bot2.x > myGame.stage.width) {
            bot2.velocity.x = -200;
        }
    }
})();
