/// <reference path="../../Phaser/Game.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    function init() {

        //  Starling/Sparrow XML Texture Atlas Method 1
        //
        //  In this example we assume that the XML data is stored in an external file
        myGame.loader.addTextureAtlas('bits', 'assets/sprites/shoebox.png', 'assets/sprites/shoebox.xml', null, Phaser.Loader.TEXTURE_ATLAS_XML_STARLING);
        myGame.loader.addTextureAtlas('bot', 'assets/sprites/shoebot.png', 'assets/sprites/shoebot.xml', null, Phaser.Loader.TEXTURE_ATLAS_XML_STARLING);

        myGame.loader.load();

    }

    var bits: Phaser.Sprite;
    var bot: Phaser.Sprite;

    function create() {

        bot = myGame.add.sprite(800, 200, 'bot');
        bot.animations.add('run');
        bot.animations.play('run', 10, true);

        bits = myGame.add.sprite(200, 200, 'bits');
        bits.frame = 0;

        bot.velocity.x = -300;

    }

    function update() {

        if (bot.x < -bot.width)
        {
            bot.x = myGame.stage.width;

            bits.frame++;
            console.log(bits.frame, bits.animations.frameTotal);

            if (bits.frame == bits.animations.frameTotal - 1)
            {
                bits.frame = 0;
            }
        }

    }

})();
