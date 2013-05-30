/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);
    function init() {
        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.loader.addImageFile('atari', 'assets/sprites/atari800xl.png');
        game.loader.addImageFile('card', 'assets/sprites/mana_card.png');
        game.loader.load();
    }
    var atari;
    var card;
    function create() {
        //atari = game.add.sprite(350, 100, 'atari');
        //atari = game.add.sprite(350, 500, 'atari');
        atari = game.add.sprite(0, 310, 'atari');
        card = game.add.sprite(400, 300, 'card');
        card.physics.immovable = true;
        //atari.texture.alpha = 0.5;
        //atari.scale.setTo(1.5, 1.5);
        //atari.physics.shape.setSize(150, 50);
        //atari.physics.shape.offset.setTo(50, 25);
        //atari.physics.gravity.setTo(0, 2);
        atari.physics.bounce.setTo(0.7, 0.7);
        //atari.physics.drag.setTo(10, 10);
        //card.physics.bounce.setTo(0.7, 0.7);
        //card.physics.velocity.x = -50;
            }
    function update() {
        atari.physics.acceleration.x = 0;
        atari.physics.acceleration.y = 0;
        if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            atari.physics.acceleration.x = -150;
        } else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            atari.physics.acceleration.x = 150;
        }
        if(game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            atari.physics.acceleration.y = -150;
        } else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            atari.physics.acceleration.y = 150;
        }
        //  collide?
            }
    function render() {
        atari.physics.renderDebugInfo(16, 16);
        card.physics.renderDebugInfo(200, 16);
    }
})();
