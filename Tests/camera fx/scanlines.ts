/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../build/phaser-fx.d.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    function init() {

        myGame.world.setSize(1216, 896);

        myGame.loader.addImageFile('backdrop', 'assets/pics/ninja-masters2.png');

        myGame.loader.load();

    }

    var scanlines: Phaser.FX.Camera.Scanlines;

    function create() {

        //  Add our effect to the camera
        scanlines = <Phaser.FX.Camera.Scanlines> myGame.camera.fx.add(Phaser.FX.Camera.Scanlines);

        //  We'll have the scanlines spaced out every 2 pixels
        scanlines.spacing = 2;

        //  This is the color the lines will be drawn in
        scanlines.color = 'rgba(0, 0, 0, 0.8)';

        myGame.createSprite(0, 0, 'backdrop');

    }

    function update() {

        if (myGame.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            myGame.camera.scroll.x -= 4;
        }
        else if (myGame.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            myGame.camera.scroll.x += 4;
        }

        if (myGame.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            myGame.camera.scroll.y -= 4;
        }
        else if (myGame.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            myGame.camera.scroll.y += 4;
        }

    }

})();
