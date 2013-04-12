/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/Sprite.ts" />

(function () {

    var myGame = new Game(this, 'game', 800, 600, init, create, update);

    function init() {

        myGame.loader.addImageFile('melon', 'assets/sprites/melon.png');

        myGame.loader.load();

    }

    function create() {

        myGame.world.width = 3000;
        myGame.world.height = 3000;

        for (var i = 0; i < 1000; i++)
        {
            myGame.createSprite(Math.random() * 3000, Math.random() * 3000, 'melon');
        }

        myGame.stage.clear = true;

    }

    function update() {

        myGame.stage.context.fillStyle = 'rgb(255,255,255)';
        myGame.stage.context.fillText('x: ' + myGame.input.x + ' y: ' + myGame.input.y, 10, 20);

        if (myGame.input.keyboard.isDown(Keyboard.LEFT))
        {
            myGame.camera.x -= 4;
        }
        else if (myGame.input.keyboard.isDown(Keyboard.RIGHT))
        {
            myGame.camera.x += 4;
        }

        if (myGame.input.keyboard.isDown(Keyboard.UP))
        {
            myGame.camera.y -= 4;
        }
        else if (myGame.input.keyboard.isDown(Keyboard.DOWN))
        {
            myGame.camera.y += 4;
        }

    }

})();
