/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);

    function init() {

        game.world.setSize(1920, 1200, true);

        game.load.image('backdrop', 'assets/pics/remember-me.jpg');
        game.load.image('melon', 'assets/sprites/melon.png');

        game.load.start();

    }

    function create() {

        game.add.sprite(0, 0, 'backdrop');

        for (var i = 0; i < 100; i++)
        {
            game.add.sprite(game.world.randomX, game.world.randomY, 'melon');
        }

    }

    function update() {

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            game.camera.scroll.x -= 4;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            game.camera.scroll.x += 4;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            game.camera.scroll.y -= 4;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            game.camera.scroll.y += 4;
        }

    }

    function render() {

        game.camera.renderDebugInfo(32, 32);

    }

})();
