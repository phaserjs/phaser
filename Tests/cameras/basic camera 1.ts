/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, preload, create, update, render);

    function preload() {

        game.load.image('backdrop', 'assets/pics/remember-me.jpg');
        game.load.image('melon', 'assets/sprites/melon.png');

    }

    function create() {

        game.world.setSize(1920, 1200, true);

        game.add.sprite(0, 0, 'backdrop');

        for (var i = 0; i < 100; i++)
        {
            game.add.sprite(game.world.randomX, game.world.randomY, 'melon');
        }

        //game.camera.texture.alpha = 0.5;
        //game.camera.width = 400;
        game.camera.texture.opaque = true;
        game.camera.texture.backgroundColor = 'rgb(200,0,0)';
        game.camera.transform.origin.setTo(0.5, 0.5);
        game.camera.setPosition(game.stage.centerX, game.stage.centerY);
        //game.camera.setPosition(0, 0);
        //console.log('cam', game.camera.width, game.camera.height);

    }

    function update() {

        game.camera.rotation++;

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            //game.camera.x -= 4;
            game.camera.transform.scale.x -= 0.1;
            game.camera.transform.scale.y -= 0.1;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            //game.camera.x += 4;
            game.camera.transform.scale.x += 0.1;
            game.camera.transform.scale.y += 0.1;
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

        Phaser.DebugUtils.renderCameraInfo(game.camera, 32, 32);

    }

})();
