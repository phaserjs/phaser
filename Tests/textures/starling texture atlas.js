/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update);
    function init() {
        //  Starling/Sparrow XML Texture Atlas Method 1
        //
        //  In this example we assume that the XML data is stored in an external file
        game.load.atlas('bits', 'assets/sprites/shoebox.png', 'assets/sprites/shoebox.xml', null, Phaser.Loader.TEXTURE_ATLAS_XML_STARLING);
        game.load.atlas('bot', 'assets/sprites/shoebot.png', 'assets/sprites/shoebot.xml', null, Phaser.Loader.TEXTURE_ATLAS_XML_STARLING);
        game.load.start();
    }
    var bits;
    var bot;
    function create() {
        bot = game.add.sprite(800, 200, 'bot');
        bot.animations.add('run');
        bot.animations.play('run', 20, true);
        bits = game.add.sprite(200, 200, 'bits');
        bits.frame = 0;
    }
    function update() {
        bot.x -= 5;
        if(bot.x < -bot.width) {
            bot.x = game.stage.width;
            bits.frame++;
            if(bits.frame == bits.animations.frameTotal - 1) {
                bits.frame = 0;
            }
        }
    }
})();
