/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);

    function init() {

        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.loader.addImageFile('atari', 'assets/sprites/atari800xl.png');
        game.loader.addImageFile('card', 'assets/sprites/mana_card.png');
        game.loader.load();

    }

    var atari: Phaser.Sprite;
    var card: Phaser.Sprite;

    function create() {

        //atari = game.add.sprite(350, 100, 'atari');
        //atari = game.add.sprite(350, 500, 'atari');
        atari = game.add.sprite(0, 310, 'atari');
        card = game.add.sprite(400, 300, 'card');

        //card.body.immovable = true;

        //atari.texture.alpha = 0.5;
        //atari.scale.setTo(1.5, 1.5);

        //atari.body.shape.setSize(150, 50);
        //atari.body.shape.offset.setTo(50, 25);

        //atari.body.gravity.setTo(0, 2);
        atari.body.bounce.setTo(1, 1);
        //atari.body.drag.setTo(10, 10);

        card.body.bounce.setTo(0.7, 0.7);
        //card.body.velocity.x = -50;

    }

    function update() {

        atari.body.acceleration.x = 0;
        atari.body.acceleration.y = 0;

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            atari.body.acceleration.x = -150;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            atari.body.acceleration.x = 150;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            atari.body.acceleration.y = -150;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            atari.body.acceleration.y = 150;
        }

        //  collide?

    }

    function render() {

        atari.body.renderDebugInfo(16, 16);
        card.body.renderDebugInfo(200, 16);

    }

})();
