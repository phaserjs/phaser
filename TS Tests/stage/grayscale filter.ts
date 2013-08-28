/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, preload, create, update);

    function preload() {

        game.load.image('backdrop', 'assets/pics/remember-me.jpg');
        

    }

    function create() {

        game.world.setSize(1920, 1200);

        game.add.sprite(0, 0, 'backdrop');

        //  Apply a 100% contrast filter to the entire game (this value can be tweened, modified in-game, etc)
        game.stage.css3.grayscale = 100;

    }

    function update() {

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            game.camera.x -= 4;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            game.camera.x += 4;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            game.camera.y -= 4;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            game.camera.y += 4;
        }

    }

})();
