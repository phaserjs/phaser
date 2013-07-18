/// <reference path="../../Phaser/Game.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    function init() {

        myGame.world.setSize(1920, 1920);

        myGame.loader.addImageFile('grid', 'assets/tests/debug-grid-1920x1920.png');
        myGame.loader.addImageFile('melon', 'assets/sprites/melon.png');
        myGame.loader.addImageFile('carrot', 'assets/sprites/carrot.png');

        myGame.loader.load();

    }

    var melon: Phaser.Sprite;

    function create() {

        //  locked to the camera
        myGame.add.sprite(0, 0, 'grid');

        melon = myGame.add.sprite(600, 650, 'melon');
        melon.scrollFactor.setTo(1.5, 1.5);

        //  scrolls x2 camera speed
        for (var i = 0; i < 100; i++)
        {
            var tempSprite = myGame.add.sprite(Math.random() * myGame.world.width, Math.random() * myGame.world.height, 'carrot');
            tempSprite.scrollFactor.setTo(2, 2);
        }

    }

    function update() {

        myGame.camera.renderDebugInfo(32, 32);
        melon.renderDebugInfo(200, 32);

        if (myGame.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            myGame.camera.focusOnXY(640, 640);
        }
        else if (myGame.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            myGame.camera.focusOnXY(1234, 800);
        }
        else if (myGame.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            myGame.camera.focusOnXY(50, 200);
        }
        else if (myGame.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            myGame.camera.focusOnXY(1700, 1700);
        }

    }

})();
