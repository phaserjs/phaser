/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/Sprite.ts" />
(function () {
    var myGame = new Game(this, 'game', 800, 600, init, create, update);
    function init() {
        myGame.loader.addImageFile('background', 'assets/pics/remember-me.jpg');
        myGame.loader.addImageFile('car', 'assets/sprites/car90.png');
        myGame.loader.load();
    }
    var car;
    function create() {
        myGame.createSprite(0, 0, 'background');
        car = myGame.createSprite(400, 300, 'car');
    }
    function update() {
        myGame.camera.renderDebugInfo(32, 32);
        car.velocity.x = 0;
        car.velocity.y = 0;
        car.angularVelocity = 0;
        car.angularAcceleration = 0;
        if(myGame.input.keyboard.isDown(Keyboard.LEFT)) {
            car.angularVelocity = -200;
        } else if(myGame.input.keyboard.isDown(Keyboard.RIGHT)) {
            car.angularVelocity = 200;
        }
        if(myGame.input.keyboard.isDown(Keyboard.UP)) {
            var motion = myGame.math.velocityFromAngle(car.angle, 300);
            car.velocity.copyFrom(motion);
        }
        //  Shake the camera when the car hits the edges, a different intensity per edge
        if(car.x < 0) {
            myGame.camera.shake();
            car.x = 0;
        } else if(car.x > myGame.world.width) {
            myGame.camera.shake(0.02);
            car.x = myGame.world.width - car.width;
        }
        if(car.y < 0) {
            myGame.camera.shake(0.07, 1);
            car.y = 0;
        } else if(car.y > myGame.world.height) {
            myGame.camera.shake(0.1);
            car.y = myGame.world.height - car.height;
        }
    }
})();
