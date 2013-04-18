/// <reference path="../../Phaser/Game.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    function init() {

        myGame.world.setSize(3000, 3000);

        myGame.loader.addImageFile('melon', 'assets/sprites/melon.png');

        myGame.loader.load();

    }

    var cam2: Phaser.Camera;

    function create() {

        for (var i = 0; i < 1000; i++)
        {
            myGame.createSprite(Math.random() * 3000, Math.random() * 3000, 'melon');
        }

        myGame.camera.setPosition(16, 80);
        myGame.camera.setSize(320, 320);
        myGame.camera.showBorder = true;
        myGame.camera.borderColor = 'rgb(255,0,0)';

        cam2 = myGame.createCamera(380, 100, 400, 400);
        cam2.showBorder = true;
        cam2.borderColor = 'rgb(255,255,0)';

    }

    function update() {

        myGame.camera.renderDebugInfo(16, 16);
        cam2.renderDebugInfo(200, 16);

        if (myGame.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            myGame.camera.x -= 4;
            cam2.x -= 2;
        }
        else if (myGame.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
            {
            myGame.camera.x += 4;
            cam2.x += 2;
        }

        if (myGame.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            myGame.camera.y -= 4;
            cam2.y -= 2;
        }
        else if (myGame.input.keyboard.isDown(Phaser.Keyboard.DOWN))
            {
            myGame.camera.y += 4;
            cam2.y += 2;
        }

    }

})();
