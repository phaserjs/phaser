/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);
    function init() {
        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.loader.addImageFile('atari', 'assets/sprites/atari800xl.png');
        game.loader.load();
    }
    var atari;
    function create() {
        atari = game.add.sprite(200, 300, 'atari');
        atari.texture.alpha = 0.5;
        //atari.scale.setTo(2, 2);
        atari.physics.shape.setSize(150, 50);
        atari.physics.shape.offset.setTo(250, 25);
        //atari.physics.gravity.setTo(0, 2);
        atari.physics.bounce.setTo(0.7, 0.7);
        atari.physics.drag.setTo(10, 10);
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
    }
    function render() {
        atari.physics.renderDebugInfo(16, 16);
    }
})();
