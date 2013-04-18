/// <reference path="../../Phaser/Game.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);
    function init() {
        myGame.world.setSize(2240, 2240);
        myGame.loader.addImageFile('balls', 'assets/sprites/balls.png');
        myGame.loader.addImageFile('car', 'assets/sprites/car90.png');
        myGame.loader.load();
    }
    var car;
    var miniCam;
    var bigCam;
    function create() {
        //myGame.createSprite('grid', 0, 0);
        car = myGame.createSprite(400, 300, 'car');
        myGame.camera.setTexture('balls');
        myGame.camera.follow(car);
        myGame.camera.deadzone = new Phaser.Rectangle(64, 64, myGame.stage.width - 128, myGame.stage.height - 128);
        myGame.camera.setBounds(0, 0, myGame.world.width, myGame.world.height);
        //miniCam = myGame.createCamera(600, 32, 200, 200);
        //miniCam.follow(car, Camera.STYLE_LOCKON);
        //miniCam.setBounds(0, 0, myGame.world.width, myGame.world.height);
        //miniCam.showBorder = true;
        //miniCam.scale.setTo(0.5, 0.5);
        //bigCam = myGame.createCamera(32, 32, 200, 200);
        //bigCam.follow(car, Camera.STYLE_LOCKON);
        //bigCam.setBounds(0, 0, myGame.world.width, myGame.world.height);
        //bigCam.showBorder = true;
        //bigCam.scale.setTo(2, 2);
            }
    function update() {
        car.velocity.x = 0;
        car.velocity.y = 0;
        car.angularVelocity = 0;
        car.angularAcceleration = 0;
        if(myGame.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            car.angularVelocity = -200;
        } else if(myGame.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            car.angularVelocity = 200;
        }
        if(myGame.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            var motion = myGame.motion.velocityFromAngle(car.angle, 300);
            car.velocity.copyFrom(motion);
        }
    }
})();
