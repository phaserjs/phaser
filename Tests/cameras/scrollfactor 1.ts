/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);

    function init() {

        game.world.setSize(1920, 1200, true);

        game.loader.addImageFile('backdrop', 'assets/pics/remember-me.jpg');
        game.loader.addImageFile('ball', 'assets/sprites/shinyball.png');

        game.loader.load();

    }

    function create() {

        game.add.sprite(0, 0, 'backdrop');

        for (var i = 0; i < 400; i++)
        {
            var tempBall:Phaser.Sprite = game.add.sprite(game.world.randomX * 2, game.world.randomY * 2, 'ball');
            tempBall.scrollFactor.setTo(2, 2);
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
