/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);

    function init() {

        game.load.image('melon', 'assets/sprites/melon.png');

        game.load.start();

    }

    var car: Phaser.Sprite;
    var miniCam: Phaser.Camera;

    function create() {

        game.world.setSize(3000, 3000, true);
        game.stage.backgroundColor = 'rgb(20,20,50)';

        for (var i = 0; i < 1000; i++)
        {
            game.add.sprite(game.world.randomX, game.world.randomY, 'melon');
        }

        game.camera.transform.origin.setTo(0.5, 0.5);
        game.camera.texture.opaque = true;
        game.camera.texture.backgroundColor = 'rgb(0,0,0)';
        game.camera.setPosition(game.stage.centerX, game.stage.centerY);
        //game.camera.setPosition(200, 0);
        game.camera.setSize(320, 320);

    }

    function update() {

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            game.camera.rotation -= 2;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            game.camera.rotation += 2;
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
