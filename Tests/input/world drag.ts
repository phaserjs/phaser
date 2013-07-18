/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);

    function init() {

        game.world.setSize(1920, 1200, true);

        game.load.image('backdrop', 'assets/pics/remember-me.jpg');
        game.load.image('melon', 'assets/sprites/melon.png');

        game.load.start();

    }

    var test: Phaser.Sprite;

    function create() {

        game.add.sprite(0, 0, 'backdrop');

        for (var i = 0; i < 1; i++)
        {
            //var sprite: Phaser.Sprite = game.add.sprite(game.world.randomX, game.world.randomY, 'melon');
            //sprite.input.start(i, false, true);
            //sprite.input.enableDrag();

            test = game.add.sprite(700, 200, 'melon');
            test.input.start(i, false, true);
            test.input.enableDrag();


        }

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

    function render() {

        game.camera.renderDebugInfo(32, 32);

        Phaser.DebugUtils.renderSpriteInfo(test, 32, 200);

        game.input.renderDebugInfo(300, 200);

    }

})();
