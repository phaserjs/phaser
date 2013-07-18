/// <reference path="../../Phaser/Game.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    function init() {

        myGame.world.setSize(3000, 3000);

        myGame.loader.addImageFile('car', 'assets/sprites/car.png');
        myGame.loader.addImageFile('coin', 'assets/sprites/coin.png');
        myGame.loader.addImageFile('melon', 'assets/sprites/melon.png');

        myGame.loader.load();

    }

    var cam2: Phaser.Camera;

    function create() {

        for (var i = 0; i < 1000; i++)
        {
            myGame.add.sprite(Math.random() * 3000, Math.random() * 3000, 'melon');
        }

        myGame.camera.setPosition(16, 80);
        myGame.camera.setSize(320, 320);
        myGame.camera.showBorder = true;
        myGame.camera.borderColor = 'rgb(255,0,0)';

        cam2 = myGame.add.camera(380, 100, 400, 400);
        //cam2.transparent = false;
        //cam2.backgroundColor = 'rgb(20,20,20)';
        cam2.showBorder = true;
        cam2.borderColor = 'rgb(255,255,0)';

    }

    function update() {

        myGame.camera.renderDebugInfo(16, 16);
        cam2.renderDebugInfo(200, 16);

        if (myGame.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            myGame.camera.scroll.x -= 4;
            cam2.scroll.x -= 2;
        }
        else if (myGame.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
            {
            myGame.camera.scroll.x += 4;
            cam2.scroll.x += 2;
        }

        if (myGame.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            myGame.camera.scroll.y -= 4;
            cam2.scroll.y -= 2;
        }
        else if (myGame.input.keyboard.isDown(Phaser.Keyboard.DOWN))
            {
            myGame.camera.scroll.y += 4;
            cam2.scroll.y += 2;
        }

    }

})();
