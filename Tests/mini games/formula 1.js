/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/Sprite.ts" />
(function () {
    var myGame = new Game(this, 'game', 840, 400, init, create, update);
    function init() {
        myGame.loader.addImageFile('track', 'assets/games/f1/track.png');
        myGame.loader.addImageFile('car', 'assets/games/f1/car1.png');
        myGame.loader.load();
    }
    var car;
    var bigCam;
    function create() {
        myGame.camera.setBounds(0, 0, myGame.stage.width, myGame.stage.height);
        myGame.createSprite(0, 0, 'track');
        car = myGame.createSprite(180, 298, 'car');
        car.rotation = 180;
        car.maxVelocity.setTo(150, 150);
        bigCam = myGame.createCamera(640, 0, 100, 200);
        bigCam.follow(car, Camera.STYLE_LOCKON);
        bigCam.setBounds(0, 0, myGame.stage.width, myGame.stage.height);
        bigCam.showBorder = true;
        bigCam.borderColor = 'rgb(0,0,0)';
        bigCam.scale.setTo(2, 2);
    }
    function update() {
        if(myGame.input.keyboard.isDown(Keyboard.LEFT)) {
            car.rotation -= 4;
        } else if(myGame.input.keyboard.isDown(Keyboard.RIGHT)) {
            car.rotation += 4;
        }
        if(myGame.input.keyboard.isDown(Keyboard.UP)) {
            car.velocity.copyFrom(myGame.math.velocityFromAngle(car.angle, 150));
        } else {
            car.velocity.copyFrom(myGame.math.velocityFromAngle(car.angle, 60));
        }
    }
})();
