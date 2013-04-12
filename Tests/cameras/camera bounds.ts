/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/Sprite.ts" />

(function () {

    var myGame = new Game(this, 'game', 800, 600, init, create, update);

    function init() {

        myGame.world.setSize(1920, 1200);
        myGame.camera.setBounds(0, 0, 1920, 1200);

        myGame.loader.addImageFile('backdrop', 'assets/pics/remember-me.jpg');
        myGame.loader.addImageFile('melon', 'assets/sprites/melon.png');

        myGame.loader.load();

    }

    function create() {

        myGame.createSprite(0, 0, 'backdrop');

        for (var i = 0; i < 100; i++)
        {
            myGame.createSprite(Math.random() * myGame.world.width, Math.random() * myGame.world.height, 'melon');
        }

    }

    function update() {

        myGame.camera.renderDebugInfo(32, 32);

        if (myGame.input.keyboard.isDown(Keyboard.LEFT))
        {
            myGame.camera.scroll.x -= 4;
        }
        else if (myGame.input.keyboard.isDown(Keyboard.RIGHT))
        {
            myGame.camera.scroll.x += 4;
        }

        if (myGame.input.keyboard.isDown(Keyboard.UP))
        {
            myGame.camera.scroll.y -= 4;
        }
        else if (myGame.input.keyboard.isDown(Keyboard.DOWN))
        {
            myGame.camera.scroll.y += 4;
        }

    }

})();
