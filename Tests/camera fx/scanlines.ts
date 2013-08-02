/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../build/phaser-fx.d.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    function init() {

        game.load.image('backdrop', 'assets/pics/ninja-masters2.png');

        game.load.start();

    }

    var scanlines: Phaser.FX.Camera.Scanlines;

    function create() {

        game.world.setSize(1216, 896);

        //  Add our effect to the camera
        scanlines = <Phaser.FX.Camera.Scanlines> game.camera.fx.add(Phaser.FX.Camera.Scanlines);

        //  We'll have the scanlines spaced out every 2 pixels
        scanlines.spacing = 2;

        //  This is the color the lines will be drawn in
        scanlines.color = 'rgba(0, 0, 0, 0.8)';

        game.add.sprite(0, 0, 'backdrop');

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
