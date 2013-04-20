/// <reference path="../../Phaser/Game.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    function init() {

        myGame.loader.addImageFile('teddy', 'assets/pics/profil-sad_plush.png');

        myGame.loader.load();

    }

    var teddy: Phaser.Sprite;

    function create() {

        teddy = myGame.createSprite(0, 0, 'teddy');
        teddy.x = myGame.stage.centerX - teddy.width / 2;
        teddy.y = myGame.stage.centerY - teddy.height / 2;
        teddy.renderDebug = true;

    }

    function update() {

        if (myGame.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            teddy.angularAcceleration = -40;
        }
        else if (myGame.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            teddy.angularAcceleration = 40;
        }

    }

})();
