/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create, update);

    function preload() {
        game.load.image('backdrop', 'assets/pics/large-color-wheel.png');
        game.load.image('coke', 'assets/sprites/cokecan.png');
        game.load.image('mushroom', 'assets/sprites/mushroom2.png');
    }

    var hue = 0;

    function create() {
        game.world.setSize(800, 800);

        game.add.sprite(0, 0, 'backdrop');
        game.add.sprite(30, 20, 'coke');
        game.add.sprite(600, 20, 'mushroom');
    }

    function update() {
        //  The value is given in degrees, so between 0 and 360, hence the wrapValue call below.
        hue = game.math.wrapValue(hue, 1, 360);

        //  Apply a hue rotation to the stage
        game.stage.css3.hueRotate = hue;

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            game.camera.y -= 4;
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            game.camera.y += 4;
        }
    }
})();
