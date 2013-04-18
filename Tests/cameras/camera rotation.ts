/// <reference path="../../Phaser/Game.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    function init() {

        myGame.world.setSize(3000, 3000);

        myGame.loader.addImageFile('car', 'assets/sprites/car.png');
        myGame.loader.addImageFile('melon', 'assets/sprites/melon.png');

        myGame.loader.load();

    }

    function create() {

        for (var i = 0; i < 1000; i++)
        {
            if (Math.random() > 0.5)
            {
                myGame.createSprite(Math.random() * 3000, Math.random() * 3000, 'car');
            }
            else
            {
                myGame.createSprite(Math.random() * 3000, Math.random() * 3000, 'melon');
            }
        }

        myGame.camera.setPosition(100, 100);
        myGame.camera.setSize(320, 320);

    }

    function update() {

        myGame.camera.renderDebugInfo(600, 32);

        if (myGame.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            myGame.camera.rotation -= 2;
        }
        else if (myGame.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            myGame.camera.rotation += 2;
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
