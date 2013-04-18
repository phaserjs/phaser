/// <reference path="../../Phaser/Phaser.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);
    function init() {
        myGame.loader.addImageFile('teddy', 'assets/pics/profil-sad_plush.png');
        myGame.loader.load();
    }
    var teddy;
    function create() {
        teddy = myGame.createSprite(0, 0, 'teddy');
        teddy.x = myGame.stage.centerX - teddy.width / 2;
        teddy.y = myGame.stage.centerY - teddy.height / 2;
        teddy.origin.setTo(-100, -100);
    }
    function update() {
        teddy.angularVelocity = 0;
        //car.angularAcceleration = 0;
        if(myGame.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            teddy.angularVelocity = -200;
        } else if(myGame.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            teddy.angularVelocity = 200;
        }
    }
})();
